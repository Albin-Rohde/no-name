import { WhiteCard } from './models/WhiteCard'
import { PlayerCard } from './models/PlayerCard'

/**
 * Get a set of random WhiteCards that is not yet
 * used in the game.
 *
 * @param gameKey - game_key for the game to act on
 * @param limit - how many cards to get
 */
const getUnusedWhiteCards = async (gameKey: string, limit: number): Promise<WhiteCard[]> => {
  return await WhiteCard.createQueryBuilder('wc')
    .leftJoin(PlayerCard, 'pcr', 'pcr.id = wc.id')
    .where('pcr.game_key != :gameKey', {gameKey})
    .orWhere('pcr.game_key is null')
    .orderBy('random()')
    .limit(limit)
    .getMany()
}

export { getUnusedWhiteCards }