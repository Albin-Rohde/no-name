import { Router, Request, Response } from 'express'
import {handleRestError, loginRequired} from '../middlewares'
import { createUser } from './services'
import {RestResponse} from "../globalTypes";
import {User} from "./models/User";
import {AuthenticationError, BadRequestError} from "../error";
import bcrypt from "bcrypt";

const userRouter = Router()


/**
 * Get user on requesters session
 * if no user on session, returns null
 */
userRouter.get('/get', loginRequired, (req: Request, res: Response): Response => {
  const response: RestResponse<User> = {
    ok: true,
    err: null,
    data: req.session.user
  }
  return res.json(response)
})

/**
 * Login a user to the app
 * will look at the password and email of the body
 * and compare the password to the hashed password in database.
 *
 * Returns the authenticated user on success
 * @param body
 */
userRouter.post('/login', async (req: Request, res: Response) => {
  if(req.session.user) {
    return res.status(200).json({
      ok: true,
      err: null,
      data: req.session.user
    } as RestResponse<User>)
  }
  try {
    if(!req.body.email || !req.body.password) {
      throw new BadRequestError(`'email' and 'password' required on body`)
    }
    const user = await User.findOne({email: req.body.email})
    if(!user) {
      throw new AuthenticationError(`Could not find <User> with email ${req.body.email}`)
    }
    if(!await bcrypt.compare(req.body.password, user.password)) {
      throw new AuthenticationError('Incorrect password')
    }
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

/**
 * Logout user, destroys session for requester
 * Which will make then de-authenticated for subsequent calls
 */
userRouter.post('/logout', loginRequired, async (req: Request, res: Response): Promise<void> => {
  req.session.destroy(() => res.json({ok: true, err: null, data: {}} as RestResponse<any>))
  return
})


/**
 * Creates a new user and sets the new user to the
 * requesters session, making them authenticated.
 */
userRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body)
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
