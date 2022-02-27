import { Router, Request, Response } from 'express'
import {handleRestError, loginRequired} from '../middlewares'
import {RestResponse} from "../types";
import {CardDeck} from "./models/CardDeck";
import {CardDeckData, normalizeDeckData} from "./services";
import {CardDeckAccess} from "./models/CardDeckAccess";
import {User} from "../user/models/User";

const deckRouter = Router()

deckRouter.use(loginRequired)

deckRouter.get('/', async (req: Request, res: Response) => {
  try {
    const decks = await CardDeck.createQueryBuilder('cd')
      .leftJoin(CardDeckAccess, 'cda', 'cda.card_deck_fk = cd.id')
      .leftJoin(User, 'u', 'u.id = cda.user_id_fk')
      .where('cd.public = true')
      .orWhere('cda.user_id_fk = :userId', {userId: req.session.user.id})
      .orWhere('cd.owner_user_fk = :userId', {userId: req.session.user.id})
      .getMany()
    const deckData: CardDeckData[] = await normalizeDeckData(decks);
    const response: RestResponse<CardDeckData[]> = {
      ok: true,
      err: null,
      data: deckData
    }
    return res.json(response)
  } catch (err) {
    handleRestError(req, res, err);
  }
})

export default deckRouter