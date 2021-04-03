import { getManager } from 'typeorm';
import { PlayerCard } from './models/PlayerCard'
import { WhiteCard } from './models/WhiteCard';
import type { User } from '../user/models/User';


const getUniqueWhiteCard = async(count: number, gameKey: string) => {
	const randomCardId = Math.floor(Math.random() * (count - 0)) + 1
	let whiteCard = await WhiteCard.findOneOrFail(randomCardId)
	if(await PlayerCard.findOne({white_card_id_fk: whiteCard.id, game_key: gameKey})) {
		whiteCard = await getUniqueWhiteCard(count, gameKey)
		return whiteCard
	}
	return whiteCard
}

const getUniquePlayCard = async(count: number, game_key: string, user: User): Promise<PlayerCard> => {
	const whiteCard = await getUniqueWhiteCard(count, game_key)
	const playerCard = new PlayerCard()
	playerCard.white_card = whiteCard
	playerCard.game_key = game_key
	playerCard.user = user
	playerCard.user_id_fk = user.id
	return playerCard.save()
}


const getUniqueCards = async (card_amount: number, game_key: string, user: User): Promise<PlayerCard[]> => {
	try {
		const entityManager = getManager()
		const [{count}] = await entityManager.query(`SELECT COUNT(*) FROM white_card`)
		const cards: Promise<PlayerCard>[] = []
		for(let i = 0; i < card_amount; i++) {
			cards.push(getUniquePlayCard(count, game_key, user))
		}
		return Promise.all(cards)
	} catch(err) {
		console.log(err)
		throw new Error('Error assigning white cards to user')
	}
}

export {getUniqueCards}