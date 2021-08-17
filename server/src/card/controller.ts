import { Router, Request, Response } from 'express'
import {loginRequired, handleRestError} from '../middlewares'
import {RestResponse} from "../rest-types";
import {CardDeck} from "./models/CardDeck";

const cardRouter = Router()

cardRouter.use(loginRequired)

cardRouter.get('/decks', async (req: Request, res: Response) => {
  const decks = await CardDeck.find()
  const response: RestResponse<CardDeck[]> = {
    ok: true,
    err: null,
    data: decks
  }
  return res.json(response)
})

export default cardRouter
