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

const handleError = (socket: Socket, err: Error) => {
  console.error(err)
  socket.emit('connection_error', err.message)
}

const getGameEvent = async(io: Server, socket: Socket): Promise<void> => {
  const game = await getGameFromUser(socket.request.session.user.id)
  if (game) {
    socket.emit('update', await makeGameResponse(game))
  }
}

const joinGameEvent = async (io: Server, socket: Socket, key: string): Promise<void> => {
  const game = await getGameWithRelations(key)
  const user = await getUserWithRelation(socket.request.session.user.id)
  game.addPlayer(user)
  socket.join(key)
  io.in(key).emit('update', await makeGameResponse(game))
}

const startGameEvent = async (io: Server, socket: Socket): Promise<void> => {
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

const playCardEvent = async(io: Server, socket: Socket, cardId: number): Promise<void> => {
    const game = await getGameFromUser(socket.request.session.user.id)
    await game.currentUser.playCard(cardId)
    io.in(game.key).emit('update', await makeGameResponse(game))
}

const flipCardEvent = async(io: Server, socket: Socket, cardId: number): Promise<void> => {
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

const leaveGameEvent = async(io: Server, socket: Socket): Promise<void> => {
  const game = await getGameFromUser(socket.request.session.user.id)
  game.removePlayer(game.currentUser)
  io.in(game.key).emit('update', await makeGameResponse(game))
}

type EventFunction<T> = (io: Server, socket: Socket, ...args: T[]) => Promise<void>

/**
 * The fn argument should be a eventHandler function
 * This function will wrap <fn> in a catch block and
 * register it on the socket as a eventListener on the given
 * event in the <event> argument.
 *
 * The type <T> given to this function will be the type of the
 * any additional argument to the eventFunction <fn>
 *
 * @param io Socket.io Server instance
 * @param socket Socket.io Socket
 * @param event event string to listen for
 * @param fn eventHandler to wrap error handler around
 */
const addListener = <T>(
  io: Server,
  socket: Socket,
  event: Events,
  fn: EventFunction<T>,
): void => {
  const listenerCallback: (...args: T[]) => void = (...args: [T]) => {
    fn(io, socket, ...args).catch(err => handleError(socket, err))
  }
  socket.on(event, listenerCallback)
}

/**
 * Register events to the socket
 *
 * Handles any error the eventHandler might throw
 *
 * @param io Socket.io Server instance
 * @param socket Socket.io Socket
 */
const registerSocketEvents = (io: Server, socket: Socket) => {
  addListener<never>(io, socket, Events.GET_GAME, getGameEvent)
  addListener<string>(io, socket, Events.JOIN, joinGameEvent)
  addListener<never>(io, socket, Events.START, startGameEvent)
  addListener<never>(io, socket, Events.LEAVE_GAME, leaveGameEvent)
  addListener<number>(io, socket, Events.PLAY_CARD, playCardEvent)
  addListener<number>(io, socket, Events.FLIP_CARD, flipCardEvent)
}

export {registerSocketEvents}
