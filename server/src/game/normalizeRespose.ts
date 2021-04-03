import { CardState, PlayerCard } from '../card/models/PlayerCard'
import { User } from '../user/models/User'
import { Game } from './models/Game'
import { GameRound } from './models/GameRound'
import {getGameUser} from "../user/services";

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
	hasPlayed: boolean
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
		users: game.users ? [...game.users.map(user => normalizeUserResponse(user, currentRound))] : []
	}
}

const normalizeUserResponse = (user: User, currentRound: GameRound | undefined): UserResponse => {
	return {
		id: user.id,
		username: user.username,
		cards: user.cards ? [...user.cards.map(normalizeCardResponse)] : [],
		cardWizz: currentRound?.card_wizz_user_id_fk === user.id,
		hasPlayed: user.has_played
	}
}

const normalizeCardResponse = (card: PlayerCard): CardResponse => {
	return {
		id: card.id,
		text: card.white_card.text,
		state: card.state
	}
}

export const makeGameResponse = async (user: User): Promise<GameResponse> => {
	user.cards = getGameUser(user).cards
	await user.save()
	const currentRound = await GameRound.findOne({game_key: user.game.key, round_number: user.game.current_round})
	return normalizeGameResponse(user.game, currentRound)
}
