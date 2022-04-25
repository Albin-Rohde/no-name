import { User } from "./user/models/User";
import { NextFunction, Request, Response } from "express";
import {
  AuthenticationError,
  ExpectedError,
  GameRequiredError,
  NotFoundError,
  GameRuleError,
  WrappedValidationError,
  WrappedError
} from "./error";
import { RestResponse } from "./types";
import {expressLogger, logger, socketLogger} from "./logger/logger";
import { getUserWithRelation } from "./user/services";
import {ValidationError} from "yup";
import {Socket} from "socket.io";
import {MiddlewareMetaData} from "./lib/socket/types";
import {v4 as uuid} from 'uuid';

export const initTracingId = (req: Request, res: Response, next: NextFunction) => {
  if(!req.tracingId) {
    req.tracingId = uuid();
  }
  next();
}

const authUser = async (sessionUser: User) => {
  if(!sessionUser) {
    throw new AuthenticationError('You are not logged in.')
  }
  const user = await User.findOne(sessionUser.id, {
    relations: ['game', 'game._users'],
  });
  if(!user) {
    throw new AuthenticationError('User not found')
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

export const adminRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authUser(req.session.user)
    if (!user.admin) {
      return res.redirect('/login');
    }
    next();
  } catch (err) {
    return res.redirect('/login');
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
      name: err.name,
    },
    data: null
  }
  const extraErrorMeta = {
    userId: req.session?.user?.id,
    tracingId: req.tracingId,
    endpoint: req.originalUrl,
  };
  if (err instanceof GameRuleError) {
    err.extra = extraErrorMeta
    logger.warn(err);
    return res.status(200).json(response);
  }
  if (err instanceof ExpectedError) {
    err.extra = extraErrorMeta
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
      err = new WrappedValidationError(err, extraErrorMeta)
    }
    logger.warn(err);
    return res.status(200).json(response)
  }
  // makes sure any unexpected error is not sent to client.
  err = new WrappedError(err, extraErrorMeta)
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

export const initTracingIdSocket = async (socket: Socket): Promise<void> => {
  if (!socket.request.tracingId) {
    socket.request.tracingId = uuid();
  }
}


interface SocketEventInfo {
  eventName: string
  eventMethod: string
  arguments: any[]
  userId: number
  tracingId: string
  gameId?: string
}
export const loggerMiddleware = (socket: Socket, meta: MiddlewareMetaData): void => {
  const info: SocketEventInfo = {
    arguments: meta.args,
    eventMethod: meta.handler,
    eventName: meta.event,
    gameId: socket.request.session.user.game_fk,
    userId: socket.request.session.user.id,
    tracingId: socket.request.tracingId,
  }
  socketLogger.debug(`WS ${info.eventName} user: ${info.userId}`, info)
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
    url: req.originalUrl,
    method: req.method,
    query: req.query,
    userId: req.session?.user?.id,
    ip: req.headers["cf-connecting-ip"],
    params: req.params,
    path: req.path,
    headers: req.headers,
    tracingId: req.tracingId,
  });
  next();
}
