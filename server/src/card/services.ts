import { WhiteCard } from './models/WhiteCard'
import {CardState, WhiteCardRef} from './models/WhiteCardRef'
import {BlackCard} from "./models/BlackCard";
import {Game} from "../game/models/Game";
import {User} from "../user/models/User";
import {DbError} from "../error";
import {BlackCardRef, BlackCardState} from "./models/BlackCardRef";
import {CardDeck} from "./models/CardDeck";

/**
 * Get a set of random WhiteCards that is not yet
 * used in the game.
 *
 * @param game - Game to filter cards on
 * @param limit - how many cards to get
 */
const getUnusedWhiteCards = async (game: Game, limit: number): Promise<WhiteCard[]> => {
  if (limit === 0) {
    return []
  }
  return WhiteCard.createQueryBuilder('wc')
    .leftJoin(WhiteCardRef, 'wcr', 'wcr.white_card_id_fk = wc.id')
    .where('wcr.game_key != :gameKey OR wcr.game_key is null', {gameKey: game.key})
    .andWhere('wc.deck_fk = :deck', {deck: game.card_deck_fk})
    .orderBy('random()')
    .limit(limit)
    .getMany()
}

interface CreateWhiteCardRefInput {
  user: User,
  whiteCard: WhiteCard,
  state?: CardState,
  gameKey: string
}

const createWhiteCardRef = async (input: CreateWhiteCardRefInput): Promise<WhiteCardRef> => {
  if (!input.user.id) {
    console.log(input.user)
    throw new DbError('Can not create wcr without user id')
  }
  const wcr = new WhiteCardRef()
  wcr.user = input.user
  wcr.white_card = input.whiteCard
  wcr.state = input.state || CardState.HAND
  wcr.game_key = input.gameKey
  return await wcr.save()
}

/**
 * Get a BlackCard that does not exist on the game
 *
 * @param game
 */
const getUnusedBlackCard = async (game: Game): Promise<BlackCard> => {
  return BlackCard.createQueryBuilder('bc')
    .leftJoin(BlackCardRef, 'bcr', 'bcr.black_card_id_fk = bc.id')
    .where('bcr.game_key != :gameKey OR bcr.game_key is null', {gameKey: game.key})
    .andWhere('bc.deck_fk = :deck', {deck: game.card_deck_fk})
    .orderBy('random()')
    .getOneOrFail()
}

interface CreateBlackCardRefInput {
  state?: BlackCardState
  gameKey: string
  blackCard: BlackCard
}

const createBlackCardRef = async (input: CreateBlackCardRefInput): Promise<BlackCardRef> => {
  const blackCardRef = new BlackCardRef()
  blackCardRef.blackCard = input.blackCard
  blackCardRef.game_key = input.gameKey
  if (input.state) {
    blackCardRef.state = input.state
  }
  await blackCardRef.save()
  return blackCardRef
}

const countCardsInDeck = async (deck: CardDeck): Promise<number> => {
  return WhiteCard.createQueryBuilder('wc')
    .leftJoin(CardDeck, 'cd', 'wc.deck_fk = cd.id')
    .where('cd.id = :id', {id: deck.id})
    .getCount();
}

export { getUnusedWhiteCards, getUnusedBlackCard, createWhiteCardRef, createBlackCardRef, countCardsInDeck }
