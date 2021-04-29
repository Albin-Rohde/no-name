import { WhiteCard } from './models/WhiteCard'
import { WhiteCardRef } from './models/WhiteCardRef'
import {BlackCard} from "./models/BlackCard";
import {Game} from "../game/models/Game";

/**
 * Get a set of random WhiteCards that is not yet
 * used in the game.
 *
 * @param gameKey - game_key for the game to act on
 * @param limit - how many cards to get
 */
const getUnusedWhiteCards = async (gameKey: string, limit: number): Promise<WhiteCard[]> => {
  return await WhiteCard.createQueryBuilder('wc')
    .leftJoin(WhiteCardRef, 'wcr', 'wcr.id = wc.id')
    .where('wcr.game_key != :gameKey or wcr.game_key is null', {gameKey})
    .orWhere('wcr.game_key is null')
    .orderBy('random()')
    .limit(limit)
    .getMany()
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

export { getUnusedWhiteCards, getUnusedBlackCard }