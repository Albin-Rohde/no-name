import { getManager } from 'typeorm';
import { PlayerCard } from './models/PlayerCard'
import { WhiteCard } from './models/WhiteCard';

const getCardById = async (id: number) => {
	try {
		const card = await PlayerCard.findOneOrFail(id)
	} catch(err) {
		throw new Error('NOT_FOUND')
	}
}


const getUniqueCard = async(count: number, game_key: string): Promise<PlayerCard> => {
	const randomCardId = Math.floor(Math.random() * (count - 0))
	const whiteCard = await WhiteCard.findOneOrFail(randomCardId)
	if(await PlayerCard.findOne({white_card_id_fk: whiteCard.id, game_key: game_key})) {
		// Card is already in current game.
		return getUniqueCard(count, game_key)
	}
	const playerCard = new PlayerCard()
	playerCard.white_card = whiteCard
	playerCard.game_key = game_key
	await playerCard.save()
	return playerCard
}


const getUniqueCards = async (card_amount: number, game_key: string): Promise<PlayerCard[]> => {
	try {
		const entityManager = getManager()
		// remove type orm?
		const [{count}] = await entityManager.query(`SELECT COUNT(*) FROM white_card`)
		const cards: Promise<PlayerCard>[] = []
		for(let i = 0; i < card_amount; i++) {
			cards.push(getUniqueCard(count, game_key))
		}
		return Promise.all(cards)
	} catch(err) {
		return []
	}
}

export {getCardById, getUniqueCards}