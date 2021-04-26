import { User } from "../user/models/User"
import { Game } from "./models/Game"


/**
 * Get a game with all relations needed
 * @param key
 */
const getGameWithRelations = async (key: string): Promise<Game> => {
  try {
    return await Game.findOneOrFail(key, {
      relations: [
        'users',
        'users.cards',
        'users.cards.white_card',
        'users.game',
        'users.game.round',
      ]
    })
  } catch (err){
    console.error(err)
    throw new Error('GAME_NOT_FOUND')
  }
}

/**
 * Get the Game instance with relations associated to a User
 * @param userId
 */
const getGameFromUser = async (userId: number): Promise<Game> => {
  const user = await User.findOneOrFail(userId, {relations: ['game']})
  if(!user.game) {
    throw new Error('No Game on User')
  }
  const game = await getGameWithRelations(user.game.key)
  game.currentUser = user
  return game
}

export { getGameWithRelations, getGameFromUser }
