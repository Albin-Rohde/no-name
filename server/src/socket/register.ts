import {Server, Socket} from "socket.io";
import {
  playCardEvent,
  flipCardEvent,
  voteCardEvent,
} from './event-handler/card'
import {
  getGameEvent,
  joinGameEvent,
  startGameEvent,
  leaveGameEvent,
} from './event-handler/game'
import { Game } from "../game/models/Game";
import { GameRound } from "../game/models/GameRound";
import { normalizeGameResponse } from "./normalizeRespose";

enum Events {
  GET_GAME = 'get-game',
  JOIN = 'join',
  START = 'start',
  PLAY_CARD = 'play-card',
  FLIP_CARD = 'flip-card',
  LEAVE_GAME = 'leave-game',
}

type EventFunction<T> = (io: Server, socket: Socket, ...args: T[]) => Promise<Game>

/**
 * Prints the error to stdout and emits
 * a connection_error event with the error message
 *
 * @param socket Socket.io Socket
 * @param err Error to handle
 */
const handleError = (socket: Socket, err: Error) => {
  console.error(err)
  socket.emit('connection_error', err.message)
}

const emitUpdateEvent = async (io: Server, game: Game): Promise<void> => {
  await Promise.all(game.users.map(u => u.save()))
  await game.save()
  const currentRound = await GameRound.findOne({game_key: game.key, round_number: game.current_round})
  io.in(game.key).emit('update', normalizeGameResponse(game, currentRound))
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
  const listenerCallback = function(...args: [T]) {
    fn(io, socket, ...args)
      .then((game) => emitUpdateEvent(io, game))
      .catch(err => handleError(socket, err))
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
