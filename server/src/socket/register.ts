import {Server, Socket} from "socket.io";
import {
  getGameEvent,
  joinGameEvent,
  startGameEvent,
  leaveGameEvent,
  playCardEvent,
  flipCardEvent,
  voteCardEvent,
} from './events'

enum Events {
  GET_GAME = 'get-game',
  JOIN = 'join',
  START = 'start',
  PLAY_CARD = 'play-card',
  FLIP_CARD = 'flip-card',
  LEAVE_GAME = 'leave-game',
}

type EventFunction<T> = (io: Server, socket: Socket, ...args: T[]) => Promise<void>

/**
 * Prints the error to stdout and emits
 * a connection_error event with the error message
 *
 * @param socket Socket.io Socket
 * @param err Error to handle
 */
export const handleError = (socket: Socket, err: Error) => {
  console.error(err)
  socket.emit('connection_error', err.message)
}

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
  addListener<number>(io, socket, Events.FLIP_CARD, voteCardEvent)
}

export {registerSocketEvents}
