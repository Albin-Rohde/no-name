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

const gameRoundCompositeKey = (game: Game, roundNumber: number = game.current_round) => {
	return `${game.key}_${roundNumber}`
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

const deleteGame = async (user: User) => {
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
}

const givePlayersCards = async (game: Game) => {
	await Promise.all(game.users.map(async (user) => {
		user.cards = await getUniqueCards(game.play_cards - user.cards.length, game.key)
		return user.save()
	}))
}

const addPlayerToGame = async (game: Game, user: User) => {
	if(game.users.length === game.player_limit) {
		throw new Error('Player limit reached.')
	}
	if(!game.users.some(u => u.id === user.id)) {
		game.users.push(user)
		await game.save()
	}
}

const createRounds = async (game: Game) => {
	if(game.users.length === 0) throw new Error('No users on game.')
	let userIdx = 0
	for(let r = 0; r < game.rounds; r++) {
		if(userIdx > game.users.length-1) userIdx = 0
		const round = new GameRound()
		round.game_key = game.key
		round.round_number = r+1
		round.CardWizz = game.users[userIdx]
		await round.save()
		userIdx++
	}
}

const startGame = async (game: Game) => {
	if(game.started) {
		throw new Error('Game already started')
	} else {
		await Promise.all([givePlayersCards(game), createRounds(game)])
		game.started = true
		await game.save()
	}
}

const handlePlayCard = async (user: User, cardId: number) => {
		const card = await PlayerCard.findOne({id: cardId, game_key: user.game.key, user_id_fk: user.id})
		if(card) {
			if(card.state === CardState.PLAYED_HIDDEN) {
				throw new Error('Card has already been played.')
			} else {
				card.state = CardState.PLAYED_HIDDEN
				await card.save()
			}
		}
}

export {createNewGame, deleteGame, getGameByKey, givePlayersCards, addPlayerToGame, startGame, handlePlayCard}
