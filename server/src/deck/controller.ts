import { Router, Request, Response } from 'express'
import {handleRestError, loginRequired} from '../middlewares'
import {RestResponse} from "../types";
import {CardDeck} from "./models/CardDeck";
import {
  addDeckToLibrary,
  CardDeckData,
  DeckWithUser,
  getAvailableDecks,
  getDecksInLibrary,
  getDecksInvitedTo,
  getMyDecksWithRelation,
  getPublicDecks,
  invitePlayerToDeck,
  getSentInvites,
  normalizeDeckData,
  removeDeckFromLibrary,
  normalizeDeckWithUser,
  removeInviteToDeck,
  updateDeck,
  createDeck
} from "./services";
import {
  addToLibSchema, createDeckSchema, inviteUserSchema,
  updateDeckSchema,
} from "./schema";
import {ExpectedError} from "../error";
import {CardDeckUserRef} from "./models/CardDeckUserRef";

const deckRouter = Router();

deckRouter.use(loginRequired);

/**
 * Create a new card deck, owner will be requesting user.
 */
deckRouter.post('/new', async (req: Request, res: Response) => {
  try {
    const newDeck = await createDeck(req.session.user, createDeckSchema.validateSync(req.body));
    const deckRef = new CardDeckUserRef();
    deckRef.deck = newDeck;
    deckRef.user = req.session.user;
    await deckRef.save();
    return res.json({
      ok: true,
      err: null,
      data: newDeck
    } as RestResponse<CardDeck>);
  } catch (err) {
    handleRestError(req, res, err);
  }
});

/**
 * All decks available for the player
 */
deckRouter.get('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const decks = await getAvailableDecks(req.session.user);
    const deckData: CardDeckData[] = await normalizeDeckData(decks);
    const response: RestResponse<CardDeckData[]> = {
      ok: true,
      err: null,
      data: deckData
    }
    return res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
})

/**
 * All decks created and owned by the player
 */
deckRouter.get('/created', async (req: Request, res: Response): Promise<Response> => {
  try {
    const decks = await getMyDecksWithRelation(req.session.user);
    const deckData = await normalizeDeckWithUser(decks);
    const response: RestResponse<DeckWithUser[]> = {
      ok: true,
      err: null,
      data: deckData,
    }
    return res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
})

/**
 * All public decks not added to library, and not owned by player
 */
deckRouter.get('/public', async (req: Request, res: Response): Promise<Response> => {
  try {
    const decks = await getPublicDecks(req.session.user);
    const deckData = await normalizeDeckData(decks);
    const response: RestResponse<CardDeckData[]> = {
      ok: true,
      err: null,
      data: deckData,
    }
    return res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
})

deckRouter.post('/update/:deckId', async (req: Request, res: Response): Promise<Response> => {
  try {
    const updateDeckInput = updateDeckSchema.validateSync(req.body);
    const deckId = Number(req.params.deckId)
    const updatedDeck = await updateDeck(deckId, req.session.user, updateDeckInput);
    const [deckData] = await normalizeDeckData([updatedDeck]);
    const response: RestResponse<CardDeckData> = {
      ok: true,
      err: null,
      data: deckData,
    }
    return res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
});

/**
 * Decks in players library
 */
deckRouter.get('/library', async (req: Request, res: Response): Promise<Response> => {
  try {
    const decks = await getDecksInLibrary(req.session.user);
    const deckData = await normalizeDeckData(decks);
    const response: RestResponse<CardDeckData[]> = {
      ok: true,
      err: null,
      data: deckData,
    }
    return res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
});

deckRouter.post('/library/add', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { cardDeckId } = addToLibSchema.validateSync(req.body);
    const deck: CardDeck = await addDeckToLibrary(req.session.user, cardDeckId)
    const [deckData] = await normalizeDeckData([deck]);
    const response: RestResponse<CardDeckData> = {
      ok: true,
      err: null,
      data: deckData
    }
    return res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
})

deckRouter.post('/library/remove', async (req: Request, res: Response): Promise<Response> => {
  try {
    const {cardDeckId} = addToLibSchema.validateSync(req.body);
    const removedDeck = await removeDeckFromLibrary(req.session.user, cardDeckId);
    const [deckData] = await normalizeDeckData([removedDeck]);
    const response: RestResponse<CardDeckData> = {
      ok: true,
      err: null,
      data: deckData,
    }
    return res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
})

/**
 * All decks the player has been invited to
 */
deckRouter.get('/invite', async (req: Request, res: Response): Promise<Response> => {
  try {
    const decks = await getDecksInvitedTo(req.session.user);
    const deckData: CardDeckData[] = await normalizeDeckData(decks);
    const response: RestResponse<CardDeckData[]> = {
      ok: true,
      err: null,
      data: deckData,
    }
    return res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
})

deckRouter.get('/invite/sent', async (req: Request, res: Response): Promise<Response> => {
  try {
    const decks = await getSentInvites(req.session.user);
    const deckData = await normalizeDeckData(decks);
    const response: RestResponse<CardDeckData[]> = {
      ok: true,
      err: null,
      data: deckData,
    }
    return res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
})

/**
 * Invite player to deck owned by requesting user
 */
deckRouter.post('/invite', async (req: Request, res: Response): Promise<Response> => {
  try {
    const {cardDeckId, userId} = inviteUserSchema.validateSync(req.body);
    if (userId === req.session.user.id) {
      throw new ExpectedError('You can not invite yourself');
    }
    await invitePlayerToDeck(req.session.user, userId, cardDeckId);
    const response: RestResponse<'ok'> = {
      ok: true,
      err: null,
      data: 'ok',
    }
    return res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
})

/**
 * Remove invite
 */
deckRouter.post('/invite/remove', async (req: Request, res: Response): Promise<Response> => {
  try {
    const {cardDeckId, userId} = inviteUserSchema.validateSync(req.body);
    await removeInviteToDeck(req.session.user, userId, cardDeckId)
    const response: RestResponse<'ok'> = {
      ok: true,
      err: null,
      data: 'ok',
    }
    return res.json(response);
  } catch (err) {
    handleRestError(req, res, err);
  }
})

/**
 * Get card deck by id.
 */
deckRouter.get('/:id', async (req: Request, res: Response): Promise<Response> => {
  try {
    const deckId = req.params.id;
    if (!deckId) {
      return res.status(404);
    }
    const deck = await CardDeck.findOneOrFail(deckId);
    return res.json({
      ok: true,
      err: null,
      data: deck,
    } as RestResponse<CardDeck>)
  } catch (err) {
    handleRestError(req, res, err);
  }
})

export default deckRouter;
