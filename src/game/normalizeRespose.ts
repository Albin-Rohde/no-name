import { CardState, PlayerCard } from '../card/models/PlayerCard'
import { User } from '../user/models/User'
import { Game } from '../game/models/Game'

interface GameResponse {
	key: string
	gameOptions: GameOptionsResponse
	started: boolean
	users: UserResponse[]
}

interface GameOptionsResponse {
	deck: string
	cardLimit: number
	playerLimit: number
	privateLobby: boolean
	rounds: number
}

interface UserResponse {
	id: number
	username: string
	cards: CardResponse[]
}

interface CardResponse {
	id: number
	text: string
	state: CardState
}


const normalizeGameResponse = (game: Game): GameResponse => {
	return {
		key: game.key,
		gameOptions: {
			deck: game.card_deck,
			cardLimit: game.play_cards,
			playerLimit: game.player_limit,
			privateLobby: game.private_lobby,
			rounds: game.rounds
		},
		started: game.started,
		users: [...game.users.map(normalizeUserResponse)]
	}
}

const normalizeUserResponse = (user: User): UserResponse => {
	return {
		id: user.id,
		username: user.username,
		cards: [...user.cards.map(normalizeCardResponse)]
	}
}

const normalizeCardResponse = (card: PlayerCard): CardResponse => {
	return {
		id: card.id,
		text: card.white_card.text,
		state: card.state
	}
}

export {normalizeGameResponse}