import { User } from "../user/models/User"
import { Game } from "./models/Game"
import { NotFoundError } from "../error";
import {v4 as uuidv4} from "uuid";
import {GameTurn} from "./models/GameTurn";
import {GameRuleError} from "../../socket";
import {WhiteCardRef} from "../card/models/WhiteCardRef";


/**
 * Get a game with all relations needed
 * @param key
 */
export const getGameWithRelations = async (key: string): Promise<Game> => {
  try {
    return await Game.findOneOrFail(key, {
      relations: [
        '_users',
        '_users.cards',
        '_users.cards.white_card',
        '_users.game',
        '_users.game.currentTurn',
        'blackCard',
        'currentTurn',
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
export const getGameFromUser = async (userId: number): Promise<Game> => {
  const user = await User.findOneOrFail(userId)
  if(!user.game_fk) {
    throw new NotFoundError(`could not find game on user <User ${user.id}>`)
  }
  const game = await getGameWithRelations(user.game_fk)
  game.currentUser = user
  return game
}

interface GameSettings {
  playCards: number
  rounds: number
  playerLimit: number
  private: boolean
}

/**
 * Creates a new game and store it to db for later use
 *
 * The user supplied to this function will also be attached to the game
 *
 * Returns the created game on success
 * @param user User instance, User which is creating the game
 * @param options GameSettings object, containing settings for the game
 */
export async function createNewGame (user: User, options: GameSettings): Promise<Game> {
  if(user.game) {
    await deleteGameFromUser(user)
  }
  const game = new Game()
  game.key = uuidv4()
  game.playCards = options.playCards
  game.playerLimit = options.playerLimit
  game.privateLobby = options.private
  game.rounds = options.rounds
  game.cardDeck = 'default'
  game.hostUserId = user.id
  user.game = game
  await user.save()
  return game
}


/**
 * Deletes the game on the user supplied to this function
 *
 * This will also reset any game data stored on any user attached to the deleted game
 * Such as has_played score and their relation to a game.
 *
 * Will also delete any gameRound related to the deleted game.
 * @param user
 */
export async function deleteGameFromUser (user: User): Promise<void> {
  if(!user.isHost) {
    throw new GameRuleError('User is not host, Only host can delete game')
  }
  const gameKey = user.game_fk
  const resetUser = User.createQueryBuilder()
    .where('game_fk = :gameKey', {gameKey})
    .update({
      game_fk: null,
      score: 0,
      hasPlayed: false,
    })
  const deleteWcr = WhiteCardRef.createQueryBuilder()
    .where('game_key =:gameKey', {gameKey})
    .delete()
  const deleteGame = Game.createQueryBuilder()
    .where('key = :gameKey', {gameKey})
    .delete()
  const deleteGameRound = GameTurn.createQueryBuilder()
    .where('game_key_fk = :gameKey', {gameKey})
    .delete()
  await resetUser.execute()
  await deleteGame.execute()
  await Promise.all([deleteGameRound.execute(), deleteWcr.execute()])
  return
}

/**
 * Get game currentTurn from game and currentTurn number
 * @param gameKey
 * @param roundNumber
 */
export async function getGameRound(gameKey: string, roundNumber: number) {
  return GameTurn.createQueryBuilder('gr')
    .where('gr.game_key_fk = :gameKey', {gameKey})
    .andWhere('gr.turn_number = :roundNumber', {roundNumber})
    .getOne()
}
