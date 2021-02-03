import { User } from "../user/models/User";
import { Game } from "./models/Game";

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

const deleteGame = async (user: User) => {
  const {game} = await User.findOneOrFail(user.id, {relations: ['game']})
  game.users = []
  game.save()
  game.remove()
}

export {createNewGame, deleteGame, getGameByKey}