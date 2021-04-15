import {Server, Socket} from "socket.io";
import {getGameFromUser, getGameWithRelations} from "../../game/services";
import {getUserWithRelation} from "../../user/services";
import {Game} from "../../game/models/Game";
import {EventFunction} from "./index";

export const getGameEvent: EventFunction<never> = async(io: Server, socket: Socket): Promise<Game> => {
  return getGameFromUser(socket.request.session.user.id)
}

export const joinGameEvent: EventFunction<string> = async (io: Server, socket: Socket, key: string): Promise<Game> => {
  const game = await getGameWithRelations(key)
  const user = await getUserWithRelation(socket.request.session.user.id)
  game.addPlayer(user)
  socket.join(key)
  return game
}

export const startGameEvent: EventFunction<never> = async (io: Server, socket: Socket): Promise<Game> => {
  const game = await getGameFromUser(socket.request.session.user.id)
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

export const leaveGameEvent: EventFunction<never> = async(io: Server, socket: Socket): Promise<Game> => {
  const game = await getGameFromUser(socket.request.session.user.id)
  game.removePlayer(game.currentUser)
  return game
}