import { Router, Request, Response } from 'express'
import {handleRestError, loginRequired} from '../authenticate'
import { register, login } from './services'
import {RestResponse} from "../types";
import {User} from "../../db/user/models/User";

const userRouter = Router()

userRouter.get('/get', loginRequired, (req: Request, res: Response): Response => {
  const response: RestResponse<User> = {
    ok: true,
    err: null,
    data: req.session.user
  }
  return res.json(response)
})

userRouter.post('/login', async (req: Request, res: Response) => {
  if(req.session.user) {
    return res.status(200).json({
      ok: true,
      err: null,
      data: req.session.user
    } as RestResponse<User>)
  }
  try {
    const user = await login(req.body)
    req.session.user = user
    req.session.save(() => null)
    const response: RestResponse<User> = {
      ok: true,
      err: null,
      data: user
    }
    res.json(response)
  } catch (err) {
    handleRestError(req, res, err)
  }
})

userRouter.post('/logout', loginRequired, async (req: Request, res: Response): Promise<void> => {
  req.session.destroy(() => res.json({ok: true, err: null, data: {}} as RestResponse<any>))
  return
})

userRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const user = await register(req.body)
    req.session.user = user
    req.session.save(() => null)
    const response: RestResponse<User> = {
      ok: true,
      err: null,
      data: user,
    }
    res.json(response)
  } catch(err) {
    handleRestError(req, res, err)
  }
})

export default userRouter
