import type { Server, Socket } from 'socket.io'
import { getGameFromUser } from "../../game/services";
import {Game} from "../../game/models/Game";

export const playCardEvent = async(io: Server, socket: Socket, cardId: number): Promise<Game> => {
  const game = await getGameFromUser(socket.request.session.user.id)
  await game.currentUser.playCard(cardId)
  return game
}

export const flipCardEvent = async(io: Server, socket: Socket, cardId: number): Promise<Game> => {
  const game = await getGameFromUser(socket.request.session.user.id)
  if(!game.currentUser.isCardWizz) {
    throw new Error('Only card wizz can flip card')
  }
  await game.flipCard(cardId)
  return game
}

export const voteCardEvent = async(io: Server, socket: Socket, cardId: number): Promise<Game> => {
  const game = await getGameFromUser(socket.request.session.user.id)
  if(!game.currentUser.isCardWizz) {
    throw new Error('Only card wizz can vote card')
  }
  await game.voteCard(cardId)
  return game
}
