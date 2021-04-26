import {Server, Socket} from "socket.io";
import {getUserWithRelation} from "../../../db/user/services";
import {Game} from "../../../db/game/models/Game";
import {EventFunction, EventFunctionWithGame} from "./index";
import {getGameWithRelations} from "../../../db/game/services";

export const getGameEvent: EventFunctionWithGame<never> = async(game): Promise<Game> => {
  return game
}

export const joinGameEvent: EventFunction<string> = async (io: Server, socket: Socket, key): Promise<Game> => {
  const game = await getGameWithRelations(key)
  const user = await getUserWithRelation(socket.request.session.user.id)
  game.addPlayer(user)
  socket.join(game.key)
  return game
}

export const startGameEvent: EventFunctionWithGame<never> = async (game): Promise<Game> => {
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

export const leaveGameEvent: EventFunctionWithGame<never> = async(game): Promise<Game> => {
  game.removePlayer(game.currentUser)
  return game
}