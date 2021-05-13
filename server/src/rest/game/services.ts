import {User} from "../../db/user/models/User";
import {Game} from "../../db/game/models/Game";
import {v4 as uuidv4} from "uuid";
import {GameRound} from "../../db/game/models/GameRound";
import {GameRuleError} from "../../socket";
import {WhiteCardRef} from "../../db/card/models/WhiteCardRef";

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
  try {
    if(user.game) {
      await deleteGame(user)
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

    let gameRounds = []
    for(let i = 1; i <= game.rounds; i++) {
      const gameRound = new GameRound()
      gameRound.game_key = game.key
      gameRound.round_number = i
      gameRounds.push(gameRound.save())
    }
    await Promise.all(gameRounds)
    await user.save()
    return game
  } catch(err) {
    throw new Error(err)
  }
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
export async function deleteGame (user: User): Promise<void> {
  if(!user.isHost) {
    throw new GameRuleError('User is not host, Only host can delete game')
  }
  const gameKey = user.game_fk
  const updateUsers = User.createQueryBuilder('user')
    .where('user.game_fk = :gameKey', {gameKey})
    .update({
      game_fk: null,
      score: 0,
      hasPlayed: false,
    })
    .execute()
  const deleteWcr = WhiteCardRef.createQueryBuilder('wcr')
    .where('wcr.game_key =:gameKey', {gameKey})
    .delete()
    .execute()
  const deleteGame = Game.createQueryBuilder('game')
    .where('game.id = :gameKey', {gameKey})
    .delete()
    .execute()
  const deleteGameRound = GameRound.createQueryBuilder('gr')
    .where('gr.game_key_fk = :gameKey', {gameKey})
    .delete()
    .execute()
  await Promise.all([updateUsers, deleteWcr, deleteGame, deleteGameRound])
  return
}
