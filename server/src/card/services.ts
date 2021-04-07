import {getManager} from 'typeorm'
import {CardState, PlayerCard} from './models/PlayerCard'
import { WhiteCard } from './models/WhiteCard'
import type {User} from '../user/models/User'

const getRandomCardId = (count: number, usedCards: UsedCards[] = []): number => {
  let randomCardId: number
  do {
    randomCardId = Math.floor(Math.random() * (count)) + 1
  } while(usedCards.some((used) => used.id === randomCardId))
  return randomCardId
}

interface UsedCards {
  id: number
}
const getUniqueCards = async (card_amount: number, game_key: string, user: User): Promise<PlayerCard[]> => {
  try {
    const entityManager = getManager()
    const [{count}] = await entityManager.query(`SELECT COUNT(*) FROM white_card`)
    const usedCards: UsedCards[] = await entityManager.query(`
      SELECT wc.id FROM white_card AS wc
      JOIN player_card_ref AS pcr ON wc.id = pcr.white_card_id_fk
      WHERE pcr.game_key = '${game_key}';
    `)

    const cards: PlayerCard[] = []
    for(let i = 0; i < card_amount; i++) {
      const whiteCard = await WhiteCard.findOneOrFail(getRandomCardId(count, usedCards))
      usedCards.push({id: whiteCard.id})
      const card = new PlayerCard()
      card.user = user
      card.game_key = game_key
      card.state = CardState.HAND
      card.white_card = whiteCard
      cards.push(card)
    }

    return Promise.all(cards.map(c => c.save()))
  } catch(err) {
    console.log(err)
    throw new Error('Error assigning white cards to user')
  }
}

export {getUniqueCards}