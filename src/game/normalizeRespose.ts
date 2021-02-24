import { CardState, PlayerCard } from '../card/models/PlayerCard'
import { User } from '../user/models/User'
import { Game } from '../game/models/Game'
import { GameRound } from './models/GameRound'

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
	cardWizz: boolean
}

interface CardResponse {
	id: number
	text: string
	state: CardState
}


const normalizeGameResponse = (game: Game, currentRound: GameRound | undefined): GameResponse => {
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
		users: [...game.users.map(user => normalizeUserResponse(user, currentRound))]
	}
}

const normalizeUserResponse = (user: User, currentRound: GameRound | undefined): UserResponse => {
	return {
		id: user.id,
		username: user.username,
		cards: [...user.cards.map(normalizeCardResponse)],
		cardWizz: currentRound?.card_wizz_user_id_fk === user.id
	}
}

const normalizeCardResponse = (card: PlayerCard): CardResponse => {
	return {
		id: card.id,
		text: card.white_card.text,
		state: card.state
	}
}

export const makeGameResponse = async (game: Game): Promise<GameResponse> => {
	const currentRound = await GameRound.findOne({game_key: game.key, round_number: game.current_round})
	return normalizeGameResponse(game, currentRound)
}
