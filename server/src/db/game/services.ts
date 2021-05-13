import { User } from "../user/models/User"
import { Game } from "./models/Game"
import { NotFoundError } from "../error";


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
        'blackCard',
      ]
    })
  } catch (err){
    console.error(err)
    throw new NotFoundError(`Could not find <Game> with key ${key}`)
  }
}

/**
 * Get the Game instance with relations associated to a User
 * @param userId
 */
const getGameFromUser = async (userId: number): Promise<Game> => {
  const user = await User.findOneOrFail(userId)
  if(!user.game_fk) {
    throw new NotFoundError(`could not find game on user <User ${user.id}>`)
  }
  const game = await getGameWithRelations(user.game_fk)
  game.currentUser = user
  return game
}

export { getGameWithRelations, getGameFromUser }
