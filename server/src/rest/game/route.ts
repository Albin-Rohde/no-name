import { Router, Request, Response } from 'express'
import {loginRequired, gameRequired, handleRestError} from '../authenticate'
import { createNewGame, deleteGame } from './services'
import {RestResponse} from "../types";
import {Game} from "../../db/game/models/Game";
import {User} from "../../db/user/models/User";

const gameRouter = Router()

gameRouter.use(loginRequired)

gameRouter.get('/', gameRequired, async (req: Request, res: Response) => {
  const response: RestResponse<Game> = {
    ok: true,
    err: null,
    data: req.session.user.game
  }
  return res.json(response)
})

gameRouter.post('/', async (req: Request, res: Response) => {
  try{
    const game = await createNewGame(req.session.user, req.body)
    req.session.user.game = game
    req.session.save(() => null)
    const response: RestResponse<Game> = {
      ok: true,
      err: null,
      data: game
    }
    return res.json(response)
  } catch(err) {
    handleRestError(req, res, err)
  }
})

gameRouter.delete('/', gameRequired, async (req: Request, res: Response) => {
  try {
    await deleteGame(req.session.user)
    req.session.save(() => null)
    res.json()
  } catch(err) {
    handleRestError(req, res, err)
  }
})

gameRouter.get('/users', gameRequired, async (req: Request, res: Response) => {
  const response: RestResponse<User[]> = {
    ok: true,
    err: null,
    data: req.session.user.game.users
  }
  return res.json(response)
})



export default gameRouter
