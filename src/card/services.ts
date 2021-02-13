import { getManager } from 'typeorm';
import { PlayerCard } from './models/PlayerCard'

const getCardById = async (id: number) => {
	try {
		const card = await PlayerCard.findOneOrFail(id)
	} catch(err) {
		throw new Error('NOT_FOUND')
	}
}


const getUniqueCard = async(count: number): Promise<PlayerCard> => {
	const randomCardId = Math.floor(Math.random() * (count - 0))
	const card = await PlayerCard.findOneOrFail(randomCardId, {relations: ['user']})
	if(card && !card.user) {
		return card
	}
	return getUniqueCard(count)
}


const getUniqueCards = async (card_amount: number): Promise<PlayerCard[]> => {
	try {
		const entityManager = getManager()
		// remove type orm?
		const [{count}] = await entityManager.query(`SELECT COUNT(*) FROM player_card`)
		const cards: Promise<PlayerCard>[] = []
		for(let i = 0; i < card_amount; i++) {
			cards.push(getUniqueCard(count))
		}
		return Promise.all(cards)
	} catch(err) {
		return []
	}
}

export {getCardById, getUniqueCards}