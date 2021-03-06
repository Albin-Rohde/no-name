import { getManager } from 'typeorm'
import { CardState, PlayerCard } from '../card/models/PlayerCard'
import { getUniqueCards } from '../card/services'
import { User } from "../user/models/User"
import { Game } from "./models/Game"
import { GameRound } from './models/GameRound'

interface optionsShape {
  playCards: number
  rounds: number
  playerLimit: number
  private: boolean
}

const getGameByKey = async (key: string) => {
  try {
    const game = await Game.findOneOrFail(key)
    return game
  } catch {
    throw new Error('GAME_NOT_FOUND')
  }
}

const createNewGame = async (user: User, options: optionsShape) => {
  try {
    const game = new Game()
    game.play_cards = options.playCards
    game.player_limit = options.playerLimit
    game.private_lobby = options.private
    game.rounds = options.rounds
    game.card_deck = 'default'
    user.game = game
    await user.save()
    return game
  } catch(err) {
    console.log(err)
    throw new Error(err)
  }
}

const deleteGame = async (user: User): Promise<void> => {
	const {game} = await User.findOneOrFail(user.id, {relations: ['game']})
	await getManager().query(`
		UPDATE player
		SET game_fk=NULL
		WHERE game_fk = '${game.key}';
	`)
	await getManager().query(`
		DELETE FROM player_card_ref
		WHERE game_key = '${game.key}';
	`)
  game.remove()
	return
}

const givePlayersCards = async (game: Game): Promise<void[]> => {
	return Promise.all(game.users.map(async (user) => {
		user.cards = await getUniqueCards(game.play_cards - user.cards.length, game.key)
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

const startGame = async (game: Game): Promise<void> => {
	if(game.started) {
		throw new Error('Game already started')
	} else {
		await Promise.all([givePlayersCards(game), createRounds(game)])
		game.started = true
		return
	}
}

const handlePlayCard = async (user: User, cardId: number): Promise<void> => {
		const card = user.cards.filter(card => card.id == cardId)[0]
		if(card) {
			if(card.state === CardState.PLAYED_HIDDEN) throw new Error('Card has already been played.')
			else if(user.has_played)  throw new Error('User has already played a card this round.')
		 	else {
				card.state = CardState.PLAYED_HIDDEN
				user.has_played = true
				return
			}
		} else {
			throw new Error('CardId not found on user.')
		}
}

export {createNewGame, deleteGame, getGameByKey, givePlayersCards, addPlayerToGame, startGame, handlePlayCard}
