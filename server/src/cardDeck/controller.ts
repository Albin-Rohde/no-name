import { Router, Request, Response } from 'express'
import {loginRequired, handleRestError} from '../middlewares'
import {RestResponse} from "../globalTypes";
import {CardDeck} from "./models/CardDeck";

const cardDeckRouter = Router()

cardDeckRouter.use(loginRequired)

cardDeckRouter.get('/decks', async (req: Request, res: Response) => {
  const decks = await CardDeck.find()
  const response: RestResponse<CardDeck[]> = {
    ok: true,
    err: null,
    data: decks
  }
  return res.json(response)
})

export default cardDeckRouter
