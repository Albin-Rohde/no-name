import { Router, Request, Response } from 'express'
import {loginRequired, gameRequired, handleRestError} from '../authenticate'
import { createNewGame, deleteGame } from './services'

const gameRouter = Router()

gameRouter.use(loginRequired)

gameRouter.get('/', gameRequired, async (req: Request, res: Response) => {
  return res.json(req.session.user.game)
})

gameRouter.post('/', async (req: Request, res: Response) => {
  try{
    const game = await createNewGame(req.session.user, req.body)
    req.session.user.game = game
    req.session.save(() => null)
    res.json(game)
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
  return res.json(req.session.user.game.users)
})



export default gameRouter
