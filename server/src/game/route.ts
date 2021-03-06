import { Router, Request, Response } from 'express'
import { loginRequired, gameRequired } from '../authenticate'
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
    req.session.save()
    res.json(game)
  } catch(err) {
    res.status(500).json(err)
  }
})

gameRouter.delete('/', gameRequired, async (req: Request, res: Response) => {
  try {
    await deleteGame(req.session.user)
    req.session.save()
    res.json()
  } catch(err) {
    res.status(500).json(err)
  }
})

gameRouter.get('/users', gameRequired, async (req: Request, res: Response) => {
  return res.json(req.session.user.game.users)
})



export default gameRouter