import { WhiteCard } from './models/WhiteCard'
import { PlayerCard } from './models/PlayerCard'
import { BlackCard } from './models/BlackCard'

const getUnusedWhiteCards = async (gameKey: string, limit: number): Promise<WhiteCard[]> => {
  return await WhiteCard.createQueryBuilder('wc')
    .leftJoin(PlayerCard, 'pcr', 'pcr.id = wc.id')
    .where('pcr.game_key != :gameKey', {gameKey})
    .orWhere('pcr.game_key is null')
    .orderBy('random()')
    .limit(limit)
    .getMany()
}

const getRandomBlackCards = async (limit: number): Promise<BlackCard[]> => {
	return
}

export { getUnusedWhiteCards }