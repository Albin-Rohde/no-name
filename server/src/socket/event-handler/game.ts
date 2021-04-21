import {Server, Socket} from "socket.io";
import {getUserWithRelation} from "../../user/services";
import {Game} from "../../game/models/Game";
import {EventFunction, EventFunctionWithGame} from "./index";
import {getGameWithRelations} from "../../game/services";

// TODO: io and socket can be reomved from eventHandlers since they are not used anymore.
export const getGameEvent: EventFunctionWithGame<never> = async(
  io: Server,
  socket: Socket,
  game,
): Promise<Game> => {
  return game
}

export const joinGameEvent: EventFunction<string> = async (io: Server, socket: Socket, key): Promise<Game> => {
  const game = await getGameWithRelations(key)
  const user = await getUserWithRelation(socket.request.session.user.id)
  game.addPlayer(user)
  socket.join(game.key)
  return game
}

export const startGameEvent: EventFunctionWithGame<never> = async (
  io: Server,
  socket: Socket,
  game,
): Promise<Game> => {
  if(game.started) {
    throw new Error('Game already started')
  }
  if(!game.currentUser.isHost) {
    throw new Error('User is not host, only host can start game')
  }
  game.started = true
  await game.handOutCards()
  await game.assingCardWizz()
  return game
}

export const leaveGameEvent: EventFunctionWithGame<never> = async(io: Server, socket: Socket, game): Promise<Game> => {
  game.removePlayer(game.currentUser)
  return game
}