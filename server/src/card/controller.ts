import { Router, Request, Response } from 'express'
import {loginRequired} from '../middlewares'
import {RestResponse} from "../types";
import {CardDeck} from "./models/CardDeck";
import {countCardsInDeck} from "./services";

const cardRouter = Router()

cardRouter.use(loginRequired)

interface CardDeckData {
  id: number,
  name: string,
  description: string,
  cardsCount: number,
}
cardRouter.get('/decks', async (req: Request, res: Response) => {
  const decks = await CardDeck.find()
  const deckData: Promise<CardDeckData>[] = decks.map<Promise<CardDeckData>>(async (deck): Promise<CardDeckData> => {
    return {
      id: deck.id,
      name: deck.name,
      description: deck.description,
      cardsCount: await countCardsInDeck(deck),
    }
  })
  const response: RestResponse<CardDeckData[]> = {
    ok: true,
    err: null,
    data: await Promise.all(deckData)
  }
  return res.json(response)
})

export default cardRouter