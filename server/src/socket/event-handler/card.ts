import type { Server, Socket } from 'socket.io'
import { makeGameResponse } from '../normalizeRespose'
import { getGameFromUser } from "../../game/services";

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
