import { Socket, Server } from 'socket.io'
import { NextFunction, Request, Response } from 'express'
import { User } from './models/User'
import { getUserWithRelation } from './services'

const authUser = async (sessionUser: User) => {
  if(!sessionUser) {
    throw new Error('NO_SESSION_USER')
  }
  const user = await User.findOne(sessionUser.id, {relations: ['game', 'game.users']})
  if(!user) {
    throw new Error('NO_DB_USER')
  }
  if(user.email !== sessionUser.email || user.password !== sessionUser.password) {
    throw new Error('AUTH_FAILED')
  }
  return user
}

export const loginRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authUser(req.session.user)
    req.session.user = user
    req.session.save()
    next()
  } catch(err) {
    res.status(401).json(err)
  }
}

export const gameRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authUser(req.session.user)
    if(!user.game) {
      return res.status(401).json('GAME_REQUIRED')
    }
    req.session.user = user
    req.session.save()
    return next()
  } catch(err) {}
}

export const authSocketUser = async (socket: Socket, io: Server, next: any) => {
  if(!socket.request.session.user) {
    throw new Error('User required on session')
  }
  const user = await getUserWithRelation(socket.request.session.user.id)
  if(user) {
    socket.request.session.user = user
    socket.request.session.save()
    next()
  } else {
    throw new Error('Authentication for user failed.')
  }
}