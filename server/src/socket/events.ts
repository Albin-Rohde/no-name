import type { Server, Socket } from 'socket.io'
import { makeGameResponse } from './normalizeRespose'
import { getUserWithRelation } from '../user/services'
import { getGameFromUser, getGameWithRelations } from "../game/services";

enum Events {
  GET_GAME = 'get-game',
  JOIN = 'join',
  START = 'start',
  PLAY_CARD = 'play-card',
}

const socketEventHandler = async (socket: Socket, io: Server) => {
  socket.on(Events.GET_GAME, () => getGameEvent(io, socket))
  socket.on(Events.JOIN, (key: string) => joinGameEvent(io, socket, key))
  socket.on(Events.START, () => startGameEvent(io, socket))
  socket.on(Events.PLAY_CARD, (cardId: number) => playCardEvent(io, socket, cardId))
}

const getGameEvent = async(io: Server, socket: Socket) => {
  try {
    const game = await getGameFromUser(socket.request.session.user.id)
    if (game) {
      socket.emit('update', await makeGameResponse(game))
    }
  } catch(err) {
    console.error(err)
    socket.emit('connection_error', err.message)
  }
}

const joinGameEvent = async (io: Server, socket: Socket, key: string) => {
  try {
    const game = await getGameWithRelations(key)
    const user = await getUserWithRelation(socket.request.session.user.id)
    game.addPlayer(user)
    socket.join(key)
    io.in(key).emit('update', await makeGameResponse(game))
  } catch(err) {
    console.error(err)
    socket.emit('connection_error', err.message)
  }
}

const startGameEvent = async (io: Server, socket: Socket) => {
  try {
    const game = await getGameFromUser(socket.request.session.user.id)
    if(game.started) {
      throw new Error('Game already started')
    }
    if(!game.currentUser.isHost) {
      throw new Error('User is not host, only host can start game')
    }
    game.started = true
    await Promise.all([
      game.handOutCards(),
      game.createRounds(),
    ])
    io.in(game.key).emit('update', await makeGameResponse(game))
  } catch(err) {
    console.error(err)
    socket.emit('connection_error', err.message)
  }
}

const playCardEvent = async(io: Server, socket: Socket, cardId: number) => {
  try {
    const game = await getGameFromUser(socket.request.session.user.id)
    await game.currentUser.playCard(cardId)
    io.in(game.key).emit('update', await makeGameResponse(game))
  } catch(err) {
    console.error(err)
    socket.emit('connection_error', err.message)
  }
}

export {socketEventHandler}
