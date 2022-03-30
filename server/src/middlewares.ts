import { User } from "./user/models/User";
import { NextFunction, Request, Response } from "express";
import {
  AuthenticationError,
  ExpectedError,
  GameRequiredError,
  NotFoundError,
  GameRuleError,
  WrappedValidationError
} from "./error";
import { RestResponse } from "./types";
import {expressLogger, logger, socketLogger} from "./logger/logger";
import { getUserWithRelation } from "./user/services";
import {ValidationError} from "yup";
import {Socket} from "socket.io";
import {MiddlewareMetaData} from "./lib/socket/types";

const authUser = async (sessionUser: User) => {
  if(!sessionUser) {
    throw new AuthenticationError('You are not logged in.')
  }
  const user = await User.findOne(sessionUser.id, {
    relations: ['game', 'game._users'],
  });
  if(!user) {
    throw new NotFoundError(`Could not find <User> with id ${sessionUser.id}`)
  }
  return user
}

export const loginRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.user = await authUser(req.session.user)
    req.session.save()
    next()
  } catch(err) {
    handleRestError(req, res, err)
  }
}

export const gameRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authUser(req.session.user)
    if(!user.game) {
      throw new GameRequiredError(`Could not find game on user`)
    }
    req.session.user = user
    req.session.save()
    return next()
  } catch(err) {
    handleRestError(req, res, err)
  }
}

export const handleRestError = (req: Request, res: Response, err: Error) => {
  const response: RestResponse<null> = {
    ok: false,
    err: {
      message: err.message,
      name: err.name
    },
    data: null
  }
  if (err instanceof GameRuleError) {
    err.extra = {userId: req.session.user.id}
    logger.warn(err);
    return res.status(200).json(response);
  }
  if (err instanceof ExpectedError) {
    err.extra = {userId: req.session.user.id}
    logger.warn(err);
    return res.status(200).json(response);
  }
  if (err instanceof ValidationError) {
    if (err.value) {
      // remove password field from error message
      let value = {}
      for (const [k, v] of Object.entries(value)) {
        if (k !== 'password') {
          value[k] = v;
        }
      }
      err.value = value;
      err = new WrappedValidationError(err, {userId: req.session?.user?.id})
    }
    logger.warn(err);
    return res.status(200).json(response)
  }
  // makes sure any unexpected error is not sent to client.
  logger.error("Rest Error", err)
  response.err = {name: 'INTERNAL_ERROR', message: 'UNKNOWN_INTERNAL_ERROR'}
  return res.status(500).json(response)
}

export const authSocketUser = async (socket: Socket): Promise<void> => {
  if(!socket.request.session.user) {
    throw new AuthenticationError('User required on session')
  }
  const user = await getUserWithRelation(socket.request.session.user.id)
  if(user) {
    socket.request.session.user = user
    socket.request.session.save()
  } else {
    throw new AuthenticationError('Authentication for user failed.', {userId: socket.request?.session?.user?.id})
  }
}


interface SocketEventInfo {
  eventName: string
  eventMethod: string
  arguments: any[]
  userId: number
  gameId?: string
}
export const loggerMiddleware = (socket: Socket, meta: MiddlewareMetaData): void => {
  const info: SocketEventInfo = {
    arguments: meta.args,
    eventMethod: meta.handler,
    eventName: meta.event,
    gameId: socket.request.session.user.game_fk,
    userId: socket.request.session.user.id,
  }
  socketLogger.info(`WS ${info.eventName} user: ${info.userId}`, info)
}

export const expressLoggingMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  let body = undefined
  if (req.path.startsWith('/health')) {
    next();
    return;
  }
  if (!(req.path.startsWith('/user') && req.method == "POST")) {
    body = req.body
  }
  let message = `${req.method} ${req.path}`
  if (req.session?.user?.id) {
    message += ` user: ${req.session.user.id}`
  }
  expressLogger.debug(message, {
    body,
    url: req.url,
    method: req.method,
    query: req.query,
    userId: req.session?.user?.id,
    ip: req.headers["cf-connecting-ip"],
    params: req.params,
    path: req.path,
    headers: req.headers,
  })
  next();
}
