import {Request, Response, Router} from "express";
import {handleRestError, loginRequired} from "../middlewares";
import {WhiteCard, WhiteCardType} from "./models/WhiteCard";
import {BlackCard} from "./models/BlackCard";
import {CardDeck} from "../deck/models/CardDeck";
import {RestResponse} from "../types";
import {createBlackCardSchema, createWhiteCardSchema} from "./schema";
import {getAvailableDecks} from "../deck/services";
import {NotFoundError} from "../error";

const cardRouter = Router();

cardRouter.use(loginRequired);

/**
 * Get white card from id
 */
cardRouter.get('/white/:id', async (req: Request, res: Response) => {
  try {
    const whiteCard = await WhiteCard.findOneOrFail(req.params.id);
    const availableDecks = await getAvailableDecks(req.session.user);
    if (!availableDecks.some((deck) => deck.id === whiteCard.deck_fk)) {
      throw new NotFoundError('Card found but user does not have access to card deck');
    }
    return res.json({
      ok: true,
      err: null,
      data: whiteCard,
    } as RestResponse<WhiteCard>)
  } catch (err) {
    handleRestError(req, res, err)
  }
});

/**
 * Get black card from id
 */
cardRouter.get('/black/:id', async (req: Request, res: Response) => {
  try {
    const blackCard = await BlackCard.findOneOrFail(req.params.id);
    const availableDecks = await getAvailableDecks(req.session.user);
    if (!availableDecks.some((deck) => deck.id === blackCard.deck_fk)) {
      throw new NotFoundError('Card found but user does not have access to card deck');
    }
    return res.json({
      ok: true,
      err: null,
      data: blackCard,
    } as RestResponse<BlackCard>)
  } catch (err) {
    handleRestError(req, res, err);
  }
});

/**
 * Get all black and white cards within card deck
 */
cardRouter.get('/deck/:id', async (req: Request, res: Response) => {
  try {
    const deck = await CardDeck.findOneOrFail(req.params.id, {relations: ['blackCards', 'whiteCards']});
    const availableDecks = await getAvailableDecks(req.session.user);
    if (!availableDecks.some((d) => d.id === deck.id)) {
      throw new NotFoundError('Deck found but user does not have access to it');
    }
    const response: RestResponse<{blackCard: BlackCard[], whiteCard: WhiteCard[]}> = {
      ok: true,
      err: null,
      data: {
        blackCard: deck.blackCards,
        whiteCard: deck.whiteCards,
      }
    };
    return res.json(response)
  } catch (err) {
    handleRestError(req, res, err);
  }
});

/**
 * Create BlackCard assigned to a deck
 */
cardRouter.post('/black', async (req: Request, res: Response) => {
  try {
    const { deckId, text } = createBlackCardSchema.validateSync(req.body);
    const deck = await CardDeck.findOneOrFail(deckId);
    const blackCard = new BlackCard();
    blackCard.deck = deck;
    blackCard.text = text;
    await blackCard.save();
    return res.json({
      ok: true,
      err: null,
      data: 'ok',
    } as RestResponse<'ok'>)
  } catch (err) {
    handleRestError(req, res, err);
  }
});

/**
 * Create WhiteCard assigned to a deck
 */
cardRouter.post('/white', async (req: Request, res: Response) => {
  try {
    const { deckId, text, type } = createWhiteCardSchema.validateSync(req.body);
    const cardType: WhiteCardType = WhiteCardType[type];
    const deck = await CardDeck.findOneOrFail(deckId);
    const whiteCard = new WhiteCard();
    whiteCard.deck = deck;
    whiteCard.text = text;
    whiteCard.type = cardType;
    await whiteCard.save();
    return res.json({
      ok: true,
      err: null,
      data: 'ok',
    } as RestResponse<'ok'>)
  } catch (err) {
    handleRestError(req, res, err);
  }
});

export default cardRouter;