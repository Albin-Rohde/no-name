import {CardDeck} from "./models/CardDeck";
import {WhiteCard} from "../card/models/WhiteCard";
import {CardDeckUserRef} from "./models/CardDeckUserRef";
import {User} from "../user/models/User";
import {ExpectedError} from "../error";
import {BlackCard} from "../card/models/BlackCard";

const countCardsInDeck = async (deck: CardDeck): Promise<number> => {
  return WhiteCard.createQueryBuilder('wc')
    .leftJoin(CardDeck, 'cd', 'wc.deck_fk = cd.id')
    .where('cd.id = :id', {id: deck.id})
    .getCount();
}

const countBlackCardsInDeck = async (deck: CardDeck): Promise<number> => {
  return BlackCard.createQueryBuilder('bc')
    .leftJoin(CardDeck, 'cd', 'cd.id = bc.deck_fk')
    .where('cd.id = :id', {id: deck.id})
    .getCount();
}

export interface CardDeckData {
  id: number,
  name: string,
  public: boolean,
  owner: number
  description: string,
  cardsCount: number,
  blackCount: number,
}

export const normalizeDeckData = async (decks: CardDeck[]): Promise<CardDeckData[]> => {
  const deckData: Promise<CardDeckData>[] = decks.map<Promise<CardDeckData>>(async (deck): Promise<CardDeckData> => {
    return {
      id: deck.id,
      name: deck.name,
      public: deck.public,
      owner: deck._owner_user_fk,
      description: deck.description,
      cardsCount: await countCardsInDeck(deck),
      blackCount: await countBlackCardsInDeck(deck),
    }
  })
  return await Promise.all(deckData)
}

export interface DeckWithUser extends CardDeckData {
  users: {
    added: User[],
    invited: User[],
  }
}

export const normalizeDeckWithUser = async (decks: CardDeck[]): Promise<DeckWithUser[]> => {
  const deckData = decks.map( async (deck): Promise<DeckWithUser> => {
    const invited = deck.userRef
      .filter((ref) => ref.invite === true)
      .map((ref) => ref.user);
    const added = deck.userRef
      .filter((ref) => ref.invite === false)
      .map((ref) => ref.user);
    return {
      id: deck.id,
      name: deck.name,
      public: deck.public,
      owner: deck._owner_user_fk,
      description: deck.description,
      cardsCount: await countCardsInDeck(deck),
      blackCount: await countBlackCardsInDeck(deck),
      users: {
        added,
        invited,
      }
    }
  })
  return Promise.all(deckData);
}

export interface UpdateDeckInput {
  name?: string
  description?: string
  public?: boolean
  owner?: number
}
export const updateDeck = async (id: number, user: User, input: UpdateDeckInput): Promise<CardDeck> => {
  const deck = await CardDeck.findOne({where: {id, owner: user}});
  if (!deck) {
    throw new ExpectedError('Could not find Deck, or you are not owner for it.')
  }
  if (input.public !== null) {
    deck.public = input.public;
  }
  if (input.name) {
    deck.name = input.name;
  }
  if (input.description) {
    deck.description = input.description
  }
  if (input.owner) {
    const newOwner = await User.findOne({where: {id: input.owner}});
    if (newOwner) {
      deck.owner = newOwner
    }
  }
  return deck.save();
}

export interface CreateDeckInput {
  name: string
  description: string
  public: boolean
}
export const createDeck = async (user: User, input: CreateDeckInput): Promise<CardDeck> => {
  const deck = new CardDeck();
  deck.name = input.name;
  deck.description = input.description;
  deck.public = input.public;
  deck.owner = user;
  return deck.save();
}

export const getAvailableDecks = async (user: User): Promise<CardDeck[]> => {
  return CardDeck.createQueryBuilder('cd')
    .leftJoin(CardDeckUserRef, 'cdur', 'cdur.card_deck_fk = cd.id')
    .where('cd.public = true')
    .orWhere('cdur.user_id_fk = :userId', {userId: user.id})
    .orWhere('cd.owner_user_fk = :userId', {userId: user.id})
    .getMany()
}

export const getDecksInLibrary = async (user: User): Promise<CardDeck[]> => {
  return CardDeck.createQueryBuilder('cd')
    .leftJoin(CardDeckUserRef, 'cdur', 'cdur.card_deck_fk = cd.id')
    .where('cdur.user_id_fk = :userId', {userId: user.id})
    .andWhere('cdur.invite = false')
    .getMany();
}

/**
 * All public decks that are not already in library
 */
export const getPublicDecks = async (user: User): Promise<CardDeck[]> => {
  const queryBuilder = CardDeck.createQueryBuilder('cd')
  const decksInLibSubQ = queryBuilder.subQuery()
    .select('cdur.card_deck_fk')
    .from(CardDeckUserRef, 'cdur')
    .leftJoin(CardDeck, 'cd', 'cd.id = cdur.card_deck_fk')
    .where('cdur.user_id_fk = :user_id')
    .getQuery()
  return queryBuilder.where('cd.id NOT IN ' + decksInLibSubQ)
    .setParameter('user_id', user.id)
    .andWhere('cd.public = true')
    .getMany();
}

export const getDecksInvitedTo = async (user: User): Promise<CardDeck[]> => {
  return CardDeck.createQueryBuilder('cd')
    .leftJoin(CardDeckUserRef, 'cdur', 'cdur.card_deck_fk = cd.id')
    .leftJoin(User, 'u', 'u.id = cdur.user_id_fk')
    .where('u.id = :userId', {userId: user.id})
    .andWhere('cdur.invite = true')
    .getMany();
}

export const getSentInvites = async (user: User): Promise<CardDeck[]> => {
  return CardDeck.createQueryBuilder('cd')
    .leftJoin(CardDeckUserRef, 'cdur', 'cd.id = cdur.deck_fk')
    .where('cd.owner_user_fk = :userId', {userId: user.id})
    .getMany();
}

export const getMyDecksWithRelation = async (user: User): Promise<CardDeck[]> => {
  return CardDeck.find({
    where: {_owner_user_fk: user.id},
    relations: ['userRef', 'userRef.user'],
  });
}

export const addDeckToLibrary = async (user: User, deckId: number): Promise<CardDeck> => {
  const deck = await CardDeck.findOne({where: {id: deckId}})
  if (!deck) {
    throw new ExpectedError('Card deck was not found');
  }
  const deckRef = await CardDeckUserRef.findOne({where: {user, deck}});
  if (deckRef?.invite === true) {
    deckRef.invite = false;
    await deckRef.save();
    return deck;
  }
  if (!deck.public) {
   throw new ExpectedError('Card deck was not found');
  }
  const userDeckRef = new CardDeckUserRef();
  userDeckRef.deck = deck;
  userDeckRef.user = user;
  await userDeckRef.save()
  return deck;
}

export const removeDeckFromLibrary = async (user: User, id: number): Promise<CardDeck> => {
  const deck = await CardDeck.findOne({where: {id}})
  if (!deck) {
    throw new ExpectedError('Could not find card deck')
  }
  const deckRef = await CardDeckUserRef.findOne({where: {user,deck}})
  if (!deckRef) {
    throw new ExpectedError('Could not find card deck in your library')
  }
  await deckRef.remove();
  return deck;
}

export const invitePlayerToDeck = async (user: User, invitedUserId: number, deckId: number): Promise<void> => {
  const invitedUser = await User.findOne({where: {id: invitedUserId}});
  if (!invitedUser) {
    throw new ExpectedError('Could not find the user you are trying to invite');
  }
  const deck = await CardDeck.findOne({where: {owner: user, id: deckId}});
  if (!deck) {
    throw new ExpectedError('Could not find the card deck you are trying to invite to');
  }
  const deckRef = await CardDeckUserRef.findOne({where: {user: invitedUser.id, deck: deck}});
  if (deckRef) {
    throw new ExpectedError('User already invited, or already has deck');
  }
  const newDeckRef = new CardDeckUserRef();
  newDeckRef.deck = deck;
  newDeckRef.user = invitedUser;
  newDeckRef.invite = true;
  await newDeckRef.save();
}

export const removeInviteToDeck = async (user: User, invitedUserId: number, deckId: number): Promise<void> => {
  const invitedUser = await User.findOne({where: {id: invitedUserId}});
  const deckRef = await CardDeckUserRef.createQueryBuilder('cdur')
    .leftJoin(CardDeck, 'cd', 'cd.id = cdur.card_deck_fk')
    .where('cd.id = :deckId', {deckId})
    .andWhere('cd.owner_user_fk = :ownerId', {ownerId: user.id})
    .andWhere('cdur.user_id_fk = :userId', {userId: invitedUser.id})
    .getOne();
  if (!deckRef) {
    throw new ExpectedError('Invite not found');
  }
  await deckRef.remove();
}
