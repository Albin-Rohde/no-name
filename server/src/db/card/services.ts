import { WhiteCard } from './models/WhiteCard'
import {CardState, WhiteCardRef} from './models/WhiteCardRef'
import {BlackCard} from "./models/BlackCard";
import {Game} from "../game/models/Game";
import {User} from "../user/models/User";
import {DbError} from "../error";

/**
 * Get a set of random WhiteCards that is not yet
 * used in the game.
 *
 * @param gameKey - game_key for the game to act on
 * @param limit - how many cards to get
 */
const getUnusedWhiteCards = async (gameKey: string, limit: number): Promise<WhiteCard[]> => {
  if (limit === 0) {
    return []
  }
  return await WhiteCard.createQueryBuilder('wc')
    .leftJoin(WhiteCardRef, 'wcr', 'wcr.white_card_id_fk = wc.id')
    .where('wcr.game_key != :gameKey', {gameKey})
    .orWhere('wcr.game_key is null')
    .orderBy('random()')
    .limit(limit)
    .getMany()
}

interface createWhiteCardRefInput {
  user: User,
    whiteCard: WhiteCard,
    state?: CardState,
    gameKey: string
}

const createWhiteCardRef = async (input: createWhiteCardRefInput): Promise<WhiteCardRef> => {
  if (!input.user.id) {
    console.log(input.user)
    throw new DbError('Can not create wcr without user id')
  }
  const wcr = new WhiteCardRef()
  wcr.user = input.user
  wcr.white_card = input.whiteCard
  wcr.state = input.state || CardState.HAND
  wcr.game_key = input.gameKey
  await wcr.save()
  return wcr
}

/**
 * Get a BlackCard that does not exist on the game
 *
 * @param gameKey
 */
const getUnusedBlackCard = async (gameKey: string): Promise<BlackCard> => {
  return await BlackCard.createQueryBuilder('bc')
    .leftJoin(Game, 'g', 'g.black_card_id_fk = bc.id')
    .where('g.key != :gameKey or g.key is null', {gameKey})
    .orderBy('random()')
    .getOneOrFail()
}

export { getUnusedWhiteCards, getUnusedBlackCard, createWhiteCardRef }
