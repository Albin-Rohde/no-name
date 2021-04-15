import {Server, Socket} from "socket.io";
import {getGameFromUser, getGameWithRelations} from "../../game/services";
import {makeGameResponse} from "../normalizeRespose";
import {getUserWithRelation} from "../../user/services";

export const getGameEvent = async(io: Server, socket: Socket): Promise<void> => {
  const game = await getGameFromUser(socket.request.session.user.id)
  if (game) {
    socket.emit('update', await makeGameResponse(game))
  }
}

export const joinGameEvent = async (io: Server, socket: Socket, key: string): Promise<void> => {
  const game = await getGameWithRelations(key)
  const user = await getUserWithRelation(socket.request.session.user.id)
  game.addPlayer(user)
  socket.join(key)
  io.in(key).emit('update', await makeGameResponse(game))
}

export const startGameEvent = async (io: Server, socket: Socket): Promise<void> => {
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
  io.in(game.key).emit('update', await makeGameResponse(game))
}

export const leaveGameEvent = async(io: Server, socket: Socket): Promise<void> => {
  const game = await getGameFromUser(socket.request.session.user.id)
  game.removePlayer(game.currentUser)
  io.in(game.key).emit('update', await makeGameResponse(game))
}