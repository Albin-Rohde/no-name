import { CardState } from '../card/models/PlayerCard'
import { getUniqueCards } from '../card/services'
import { User } from '../user/models/User'
import { Game } from '../game/models/Game'
import { GameRound } from '../game/models/GameRound'

const givePlayersCards = async (user: User): Promise<void[]> => {
	return Promise.all(user.game.users.map(async (u) => {
		u.cards = await getUniqueCards(user.game.play_cards - u.cards.length, user.game.key, u)
		return
	}))
}

const addPlayerToGame = async (user: User, gameKey: string): Promise<void> => {
	const game = await Game.findOneOrFail(gameKey, {relations: ['users']})
	const existingUser = game.users.some(u => u.id === user.id)
	if(existingUser) return
	if(game.users.length === game.player_limit) {
		throw new Error('Player limit reached.')
	}
	if(!game.users.some(u => u.id === user.id)) {
		game.users = [...game.users, user]
		await game.save()
		user.game = game
		return
	}
}

const createRounds = async (game: Game): Promise<void> => {
	if(!game.current_round) {
		if(game.users.length === 0) throw new Error('No users on game.')
		let userIdx = 0
		for(let r = 0; r < game.rounds; r++) {
			if(userIdx > game.users.length-1) userIdx = 0
			const round = new GameRound()
			round.game_key = game.key
			round.round_number = r+1
			round.cardWizz = game.users[userIdx]
			await round.save()
			userIdx++
		}
	}
}

const startGame = async (user: User): Promise<void> => {
	if(user.game.started) {
		throw new Error('Game already started')
	} else {
		await Promise.all([givePlayersCards(user), createRounds(user.game)])
		user.game.started = true
		return
	}
}

const handlePlayCard = async (user: User, cardId: number): Promise<void> => {
		const card = user.cards.find(card => card.id == cardId)
		if(card) {
			if(card.state === CardState.PLAYED_HIDDEN) throw new Error('Card has already been played.')
			else if(user.played)  throw new Error('User has already played a card this round.')
		 	else {
				card.state = CardState.PLAYED_HIDDEN
				user.played = true
				await card.save()
				return
			}
		} else {
			throw new Error('CardId not found on user.')
		}
}

export {addPlayerToGame, startGame, handlePlayCard}