import { Router, Request, Response } from 'express'
import {handleRestError, loginRequired} from '../middlewares'
import {createUser, updateUser} from './services'
import {RestResponse} from "../types";
import {User} from "./models/User";
import {AuthenticationError, ExpectedError} from "../error";
import bcrypt from "bcrypt";
import { v4 as uuid } from 'uuid';
import sgMail from '@sendgrid/mail';
import passwordReset from "../email-templates/password-reset";
import {CreateInput, createSchema, LoginInput, loginSchema, emailSchema, updateSchema, searchSchema} from "./schema";
import {Redis} from "../redis";
import {logger} from "../logger/logger";

const redis = new Redis();
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
});

userRouter.get('/search', loginRequired, async (req: Request, res: Response) => {
  try{
    const { username } = searchSchema.validateSync(req.query);

    const response: RestResponse<User[]> = {
      ok: true,
      err: null,
      data: []
    };
    if (username.length < 2) {
      return res.json(response);
    }
    response.data = await User.createQueryBuilder('u')
      .where('u.username LIKE :username', {username: `${username}%`})
      .limit(10)
      .getMany();
    return res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
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
    const input: LoginInput = loginSchema.validateSync(req.body)
    const user = await User.createQueryBuilder('user')
      .addSelect('user.password')
      .where('LOWER(user.email) = :email', { email: input.email.toLowerCase() })
      .getOne();
    if(!user) {
      throw new AuthenticationError(`Incorrect email or password`)
    }
    const passwordOk = await bcrypt.compare(input.password, user.password)
    if (!passwordOk) {
      throw new AuthenticationError('Incorrect email or password')
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
  try {
    req.session.destroy(() => res.json({ok: true, err: null, data: {}} as RestResponse<any>))
    return
  } catch (err) {
    handleRestError(req, res, err);
  }
})


/**
 * Creates a new user and sets the new user to the
 * requesters session, making them authenticated.
 */
userRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const input: CreateInput = createSchema.validateSync(req.body)
    const user = await createUser(input)
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

userRouter.post('/send-reset', async (req: Request, res: Response) => {
  try {
    const { email } = emailSchema.validateSync(req.body);
    const user = await User.createQueryBuilder('user')
      .where('LOWER(user.email) = :email', { email: email.toLowerCase() })
      .getOne()
    if (!user) {
      throw new ExpectedError('No account with that email')
    }
    const key = uuid();
    await redis.set(key, user.id.toString(), 60 * 60); // 1 hour
    const response: RestResponse<null> = {
      ok: true,
      err: null,
      data: null,
    }
    // Do not send email when running locally.
    if (process.env.CLIENT_URL.includes('localhost')) {
      logger.info(`${process.env.CLIENT_URL}/reset/${key}`);
      return res.json(response);
    }
    const msg = {
      to: user.email,
      from: 'support@fasoner.party',
      subject: 'Password reset',
      html: passwordReset(user.username, key),
    }
    await sgMail.send(msg);
    res.json(response);
  } catch (err) {
    handleRestError(req, res, err)
  }
});

userRouter.get('/reset/:key', async (req: Request, res: Response) => {
  try {
    const userId = await redis.get(req.params.key)
    if (!userId) {
      throw new AuthenticationError('incorrect reset link')
    }
    const user = await User.findOneOrFail(Number(userId));
    const userData = {
      username: user.username,
      email: user.email,
      id: user.id,
    }
    const response: RestResponse<Pick<User, 'username' & 'email' & 'id'>> = {
      ok: true,
      err: null,
      data: userData,
    }
    res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
});

userRouter.post('/reset/:key', async (req: Request, res: Response) => {
  try {
    const userId = await redis.get(req.params.key);
    if (!userId) {
      throw new AuthenticationError('incorrect reset link')
    }
    const input = updateSchema.validateSync({...req.body, id: userId})
    await updateUser(input);
    await redis.del(req.params.key);
    const response: RestResponse<null> = {
      ok: true,
      err: null,
      data: null,
    };
    res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
})

export default userRouter
