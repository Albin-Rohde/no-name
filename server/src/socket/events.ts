import type { Server, Socket } from 'socket.io'
import { makeGameResponse } from './normalizeRespose'
import { getUserWithRelation } from '../user/services'
import { getGameFromUser, getGameWithRelations } from "../game/services";

enum Events {
  GET_GAME = 'get-game',
  JOIN = 'join',
  START = 'start',
  PLAY_CARD = 'play-card',
  FLIP_CARD = 'flip-card',
  VOTE_CARD = 'vote-card',
  LEAVE_GAME = 'leave-game',
}

const socketEventHandler = async (socket: Socket, io: Server) => {
    socket.on(Events.GET_GAME, () => getGameEvent(io, socket).catch(err => handleError(socket, err)))
    socket.on(Events.JOIN, (key: string) => joinGameEvent(io, socket, key).catch(err => handleError(socket, err)))
    socket.on(Events.START, () => startGameEvent(io, socket).catch(err => handleError(socket, err)))
    socket.on(Events.PLAY_CARD, (cardId: number) => playCardEvent(io, socket, cardId).catch(err => handleError(socket, err)))
    socket.on(Events.FLIP_CARD, (cardId: number) => flipCardEvent(io, socket, cardId).catch(err => handleError(socket, err)))
    socket.on(Events.VOTE_CARD, (cardId: number) => voteCardEvent(io, socket, cardId).catch(err => handleError(socket, err)))
    socket.on(Events.LEAVE_GAME, () => leaveGameEvent(io, socket).catch(err => handleError(socket, err)))
}

const handleError = (socket: Socket, err: Error) => {
  console.error(err)
  socket.emit('connection_error', err.message)
}

const getGameEvent = async(io: Server, socket: Socket) => {
  const game = await getGameFromUser(socket.request.session.user.id)
  if (game) {
    socket.emit('update', await makeGameResponse(game))
  }
}

const joinGameEvent = async (io: Server, socket: Socket, key: string) => {
  const game = await getGameWithRelations(key)
  const user = await getUserWithRelation(socket.request.session.user.id)
  game.addPlayer(user)
  socket.join(key)
  io.in(key).emit('update', await makeGameResponse(game))
}

const startGameEvent = async (io: Server, socket: Socket) => {
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

const playCardEvent = async(io: Server, socket: Socket, cardId: number) => {
    const game = await getGameFromUser(socket.request.session.user.id)
    await game.currentUser.playCard(cardId)
    io.in(game.key).emit('update', await makeGameResponse(game))
}

const flipCardEvent = async(io: Server, socket: Socket, cardId: number) => {
  const game = await getGameFromUser(socket.request.session.user.id)
  if(!game.currentUser.isCardWizz) {
    throw new Error('Only card wizz can flip card')
  }
  await game.flipCard(cardId)
  io.in(game.key).emit('update', await makeGameResponse(game))
}

const voteCardEvent = async(io: Server, socket: Socket, cardId: number) => {
  const game = await getGameFromUser(socket.request.session.user.id)
  if(!game.currentUser.isCardWizz) {
    throw new Error('Only card wizz can vote card')
  }
  await game.voteCard(cardId)
  io.in(game.key).emit('update', await makeGameResponse(game))
}

const leaveGameEvent = async(io: Server, socket: Socket) => {
  const game = await getGameFromUser(socket.request.session.user.id)
  game.removePlayer(game.currentUser)
  io.in(game.key).emit('update', await makeGameResponse(game))
}

export {socketEventHandler}
