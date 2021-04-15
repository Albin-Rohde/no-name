import type { Server, Socket } from 'socket.io'
import { makeGameResponse } from './normalizeRespose'
import { getUserWithRelation } from '../user/services'
import { getGameFromUser, getGameWithRelations } from "../game/services";

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

export const playCardEvent = async(io: Server, socket: Socket, cardId: number): Promise<void> => {
    const game = await getGameFromUser(socket.request.session.user.id)
    await game.currentUser.playCard(cardId)
    io.in(game.key).emit('update', await makeGameResponse(game))
}

export const flipCardEvent = async(io: Server, socket: Socket, cardId: number): Promise<void> => {
  const game = await getGameFromUser(socket.request.session.user.id)
  if(!game.currentUser.isCardWizz) {
    throw new Error('Only card wizz can flip card')
  }
  await game.flipCard(cardId)
  io.in(game.key).emit('update', await makeGameResponse(game))
}

export const voteCardEvent = async(io: Server, socket: Socket, cardId: number) => {
  const game = await getGameFromUser(socket.request.session.user.id)
  if(!game.currentUser.isCardWizz) {
    throw new Error('Only card wizz can vote card')
  }
  await game.voteCard(cardId)
  io.in(game.key).emit('update', await makeGameResponse(game))
}

export const leaveGameEvent = async(io: Server, socket: Socket): Promise<void> => {
  const game = await getGameFromUser(socket.request.session.user.id)
  game.removePlayer(game.currentUser)
  io.in(game.key).emit('update', await makeGameResponse(game))
}