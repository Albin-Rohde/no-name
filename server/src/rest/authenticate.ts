import {User} from "../db/user/models/User";
import {NextFunction, Request, Response} from "express";
import {AuthenticationError, ExpectedError, GameRequiredError} from "./error";
import {NotFoundError} from "../db/error";
import {RestResponse} from "./types";
import {GameRuleError} from "../socket";

const authUser = async (sessionUser: User) => {
  if(!sessionUser) {
    throw new AuthenticationError('NO_SESSION_USER')
  }
  const user = await User.findOne(sessionUser.id, {relations: ['game', 'game.users']})
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
      res.status(401).json(new GameRequiredError(`No game on <User> with id ${user.id}`))
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
    err: err,
    data: null
  }
  if (err instanceof ExpectedError || err instanceof GameRuleError) {
    return res.status(200).json(response);
  }
  // makes sure any unexpected error is not sent to client.
  console.error(err)
  response.err = new Error('INTERNAL_ERROR')
  return res.status(500).json(response)
}
