import { Router, Request, Response } from 'express'
import {loginRequired, gameRequired, handleRestError} from '../middlewares'
import {createNewGame, deleteGameFromUser, getGameFromJoinKey} from './services'
import {RestResponse} from "../types";
import {Game} from "./models/Game";
import {User} from "../user/models/User";
import {ExpectedError} from "../error";
import {CreateInput, createSchema, joinSchema} from "./schema";

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
    const input: CreateInput = createSchema.validateSync(req.body);
    const game = await createNewGame(req.session.user, input)
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
    await deleteGameFromUser(req.session.user)
    req.session.save(() => null)
    res.json({ok: true, err: null, data: null} as RestResponse<null>)
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

gameRouter.get('/join', async (req: Request, res: Response) => {
  try {
    const { key } = joinSchema.validateSync(req.query)
    const user = req.session.user
    const game = await getGameFromJoinKey(key)
    if (game.users.some(u => u.id === user.id)) {
      return res.redirect(process.env.CLIENT_URL)
    }
    if (user.game_fk) {
      throw new ExpectedError('User is already connected to a different game')
    }
    game.addPlayer(user)
    await game.save()
    res.redirect(process.env.CLIENT_URL)
  } catch (err) {
    handleRestError(req, res, err)
  }
})



export default gameRouter
