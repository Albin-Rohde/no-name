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
    return await Game.findOneOrFail(key)
  } catch {
    throw new Error('GAME_NOT_FOUND')
  }
}

const createNewGame = async (user: User, options: optionsShape) => {
  try {
    if(user.game) {
      await deleteGame(user)
    }
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
		SET game_fk=NULL, has_played=false
		WHERE game_fk = '${game.key}';
	`)
	await getManager().query(`
		DELETE FROM player_card_ref
		WHERE game_key = '${game.key}';
	`)
  await game.remove()
	return
}

export {createNewGame, deleteGame, getGameByKey}
