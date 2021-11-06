// fix user import
import { User } from "./user/models/User";

import { NextFunction, Request, Response } from "express";
import {
  AuthenticationError,
  ExpectedError,
  GameRequiredError,
  NotFoundError,
  GameRuleError
} from "./error";
import { RestResponse, SocketWithSession } from "./globalTypes";
import { logger, socketLogger } from "./logger/logger";
import { getUserWithRelation } from "./user/services";
import {Events} from "./app";

const authUser = async (sessionUser: User) => {
  if(!sessionUser) {
    throw new AuthenticationError('You are not logged in.')
  }
  const user = await User.findOne(sessionUser.id, {relations: ['game', 'game._users']})
  if(!user) {
    throw new NotFoundError(`Could not find <User> with id ${sessionUser.id}`)
  }
  if(user.email !== sessionUser.email || user.password !== sessionUser.password) {
    throw new AuthenticationError('AUTH_FAILED')
  }
  return user
}

export const loginRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.user = await authUser(req.session.user)
    req.session.save(() => null)
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
    req.session.save(() => null)
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
    logger.warn(err)
    return res.status(200).json(response);
  }
  if (err instanceof ExpectedError) {
    logger.error(err)
    return res.status(200).json(response);
  }
  // makes sure any unexpected error is not sent to client.
  logger.error(err)
  response.err = {name: 'INTERNAL_ERROR', message: 'UNKNOWN_INTERNAL_ERROR'}
  return res.status(500).json(response)
}

export const authSocketUser = async (socket: SocketWithSession): Promise<void> => {
  if(!socket.request.session.user) {
    throw new AuthenticationError('User required on session')
  }
  const user = await getUserWithRelation(socket.request.session.user.id)
  if(user) {
    socket.request.session.user = user
    socket.request.session.save()
  } else {
    throw new AuthenticationError('Authentication for user failed.')
  }
}


interface SocketEventInfo {
  eventName: string
  eventMethod: string
  arguments: any[]
  userId: number
  gameId?: string
}
export const loggerMiddleware = (socket: SocketWithSession, info: SocketEventInfo): void => {
  socketLogger.info('Received socket event', info)
}
