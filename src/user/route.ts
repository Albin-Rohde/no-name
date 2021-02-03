import {Router, Request, Response} from 'express'
import { loginRequired } from '../authenticate'
import { User } from './models/User'
import { create, login } from './services'

const userRouter = Router()

userRouter.get('/get', loginRequired, (req: Request, res: Response) => {
  if(req.session.user) {
    return res.json(req.session.user)
  }
  return res.sendStatus(401)
})

userRouter.post('/login', async (req: Request, res: Response) => {
  if(req.session.user) {
    return res.status(200).json(req.session.user)
  }
  try {
    const user = await login(req.body)
    req.session.user = user
    req.session.save()
    res.json(user)
  } catch(err) {
    return res.status(400).json(err.message)
  }
})

userRouter.post('/logout', loginRequired, async (req: Request, res: Response) => {
  return req.session.destroy(() => res.json())
})

userRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const user = await create(req.body)
    res.json(user)
  } catch(err) {
    return res.status(400).json(err.message)
  }
})

export default userRouter