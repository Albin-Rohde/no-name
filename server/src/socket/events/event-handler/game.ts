import {Server} from "socket.io";
import {getUserWithRelation} from "../../../db/user/services";
import {Game} from "../../../db/game/models/Game";
import {EventFunction, EventFunctionWithGame} from "./index";
import {getGameWithRelations} from "../../../db/game/services";
import {GameRuleError, GameStateError, SocketWithSession} from "../..";


/**
 * Gets a game if any is attached to the
 * user making the request.
 * @param game
 */
export const getGameEvent: EventFunctionWithGame<never> = async(game): Promise<Game> => {
  return game
}

/**
 * Joins a game by gameKey
 * @param io - websocket server
 * @param socket - live socket
 * @param key - gameKey refering to the game to join
 */
export const joinGameEvent: EventFunction<string> = async (io: Server, socket: SocketWithSession, key): Promise<Game> => {
  const game = await getGameWithRelations(key)
  const user = await getUserWithRelation(socket.request.session.user.id)
  game.addPlayer(user)
  socket.join(game.key)
  return game
}

/**
 * Start game
 * Only the gameHost can do this action.
 * @param game
 */
export const startGameEvent: EventFunctionWithGame<never> = async (game: Game): Promise<Game> => {
  if (game.started) {
    throw new GameStateError('Game already started')
  }
  if (!game.currentUser.isHost) {
    throw new GameRuleError('User is not host, only host can start game')
  }
  game.started = true
  await Promise.all([
    game.handOutCards(),
    game.assingCardWizz(),
    game.newBlackCard(),
  ])
  return game
}

/**
 * Leaves the game that the requesting user
 * is attached to.
 * @param game
 */
export const leaveGameEvent: EventFunctionWithGame<never> = async(game): Promise<Game> => {
  game.removePlayer(game.currentUser)
  return game
}
