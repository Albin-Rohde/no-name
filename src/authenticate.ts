import { Socket } from 'socket.io'
import { NextFunction, Request, Response } from 'express'
import { User } from './user/models/User'

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

// Socket.handshake.session is not accacible in types
export const authSocketUser = (socket: any, next: any) => {
	const user: User = socket.handshake.session?.user
	if(!user) {
		next(new Error('User not authenticated on session'))
	} else {
		next()
	}
}