import { Router, Request, Response } from 'express'
import {loginRequired, handleRestError} from '../authenticate'
import {RestResponse} from "../types";
import {CardDeck} from "../../db/card/models/CardDeck";

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
