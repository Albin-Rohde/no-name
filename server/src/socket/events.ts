import type { Server, Socket } from 'socket.io'
import { makeGameResponse } from './normalizeRespose'
import { getUserWithRelation } from '../user/services'
import { getGameFromUser, getGameWithRelations } from "../game/services";

const socketEventHandler = async (socket: Socket, io: Server) => {
  socket.on('join', (key: string) => joinGameEvent(io, socket, key))
  socket.on('start', () => startGameEvent(io, socket))
  socket.on('play-card', (cardId: number) => playCardEvent(io, socket, cardId))
  socket.on('get-game', () => getGameEvent(io, socket))
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
    if(game.started) throw new Error('Game already started')
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

export {socketEventHandler}
