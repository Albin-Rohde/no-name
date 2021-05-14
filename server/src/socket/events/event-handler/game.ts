import {Server} from "socket.io";
import {getUserWithRelation} from "../../../db/user/services";
import {Game} from "../../../db/game/models/Game";
import {EventFunction, EventFunctionWithGame} from "./index";
import {deleteGameFromUser, getGameFromUser, getGameWithRelations} from "../../../db/game/services";
import {GameRuleError, GameStateError, SocketWithSession} from "../..";
import {NotFoundError} from "../../../db/error";


/**
 * Gets a game if any is attached to the
 * user making the request.
 * @param io
 * @param socket
 */
export const getGameEvent: EventFunction<never> = async(io: Server, socket: SocketWithSession) => {
  try {
    const game = await getGameFromUser(socket.request.session.user.id)
    if(!socket.rooms.has(game.key)) {
      socket.join(game.key)
    }
    return game
  } catch (err) {
    if (!(err instanceof NotFoundError)) {
      return null
    }
  }
}

/**
 * Joins a game by gameKey
 * @param io - websocket server
 * @param socket - live socket
 * @param key - gameKey refering to the game to join
 */
export const joinGameEvent: EventFunction<string> = async (io: Server, socket: SocketWithSession, key) => {
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
export const startGameEvent: EventFunctionWithGame<never> = async (game: Game) => {
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
export const leaveGameEvent: EventFunctionWithGame<never> = async(game) => {
  await game.removePlayer(game.currentUser)
  return game
}

export const deleteGameEvent: EventFunctionWithGame<never> = async(game) => {
  await deleteGameFromUser(game.currentUser)
  return null
}
