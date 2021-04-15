import {Server, Socket} from "socket.io";
import * as cardHandler from './event-handler/card'
import * as gameHandler from './event-handler/game'
import { Events, EventFunction} from "./event-handler";
import { Game } from "../game/models/Game";
import { GameRound } from "../game/models/GameRound";
import { normalizeGameResponse } from "./normalizeRespose";

/**
 * Register events to the socket
 *
 * Handles any error the eventHandler might throw
 *
 * @param io Socket.io Server instance
 * @param socket Socket.io Socket
 */
export const registerSocketEvents = (io: Server, socket: Socket) => {
  addListener<never>(io, socket, Events.GET_GAME, gameHandler.getGameEvent)
  addListener<string>(io, socket, Events.JOIN, gameHandler.joinGameEvent)
  addListener<never>(io, socket, Events.START, gameHandler.startGameEvent)
  addListener<never>(io, socket, Events.LEAVE_GAME, gameHandler.leaveGameEvent)
  addListener<number>(io, socket, Events.PLAY_CARD, cardHandler.playCardEvent)
  addListener<number>(io, socket, Events.FLIP_CARD, cardHandler.flipCardEvent)
  addListener<number>(io, socket, Events.VOTE_CARD, cardHandler.voteCardEvent)
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

