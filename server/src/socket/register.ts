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
import { Events, EventFunction, EventFunctionWithGame} from "./event-handler";
import { Game } from "../game/models/Game";
import { GameRound } from "../game/models/GameRound";
import { normalizeGameResponse } from "./normalizeRespose";
import { getGameFromUser } from "../game/services";

/**
 * Register events to the socket
 *
 * Handles any error the eventHandler might throw
 *
 * @param io Socket.io Server instance
 * @param socket Socket.io Socket
 */
export const registerSocketEvents = (io: Server, socket: Socket) => {
  addListener<string>(io, socket, Events.JOIN_GAME, joinGameEvent)
  addListenerWithGame<never>(io, socket, Events.GET_GAME, getGameEvent)
  addListenerWithGame<never>(io, socket, Events.START_GAME, startGameEvent)
  addListenerWithGame<never>(io, socket, Events.LEAVE_GAME, leaveGameEvent)

  addListenerWithGame<number>(io, socket, Events.PLAY_CARD, playCardEvent)
  addListenerWithGame<number>(io, socket, Events.FLIP_CARD, flipCardEvent)
  addListenerWithGame<number>(io, socket, Events.VOTE_CARD, voteCardEvent)
}

/**
 * takes an eventFUnction wrap in in an error handler
 * register the handler on the socket as an eventListener
 *
 * The response from the eventFunction <Game> will be sent
 * to the client as an update event on every successfully event
 *
 * fetches a new Game instance on every event and send it in
 * as argument to the EventFunction
 *
 * @param io Socket.io Server instance
 * @param socket Socket.io Socket
 * @param event event string to listen for
 * @param eventFn eventHandlerFunction
 */
const addListenerWithGame = <T>(
  io: Server,
  socket: Socket,
  event: Events,
  eventFn: EventFunctionWithGame<T>,
): void => {
  async function eventCallback(...args: T[]) {
    try {
      const game = await getGameFromUser(socket.request.session.user.id)
      eventFn(game, ...args)
        .then((game) => emitUpdateEvent(io, game))
    } catch (err) {
      console.error(err)
      socket.emit('connection_error', err.message)
    }
  }
  socket.on(event, eventCallback)
}

/**
 * takes an eventFUnction wrap in in an error handler
 * register the handler on the socket as an eventListener
 *
 * The response from the eventFunction <Game> will be sent
 * to the client as an update event on every successfully event
 *
 * @param io Socket.io Server instance
 * @param socket Socket.io Socket
 * @param event event string to listen for
 * @param eventFn eventHandlerFunction
 */
const addListener = <T>(
  io: Server,
  socket: Socket,
  event: Events,
  eventFn: EventFunction<T>,
): void => {
  async function eventCallback(...args: T[]) {
    try {
      eventFn(io, socket, ...args)
        .then((game) => emitUpdateEvent(io, game))
    } catch (err) {
      console.error(err)
      socket.emit('connection_error', err.message)
    }
  }
  socket.on(event, eventCallback)
}

/**
 * Prints the error to stdout and emits
 * a connection_error event with the error message
 *
 * @param io
 * @param game
 */
const emitUpdateEvent = async (io: Server, game: Game): Promise<void> => {
  await Promise.all(game.users.map(u => u.save()))
  await game.save()
  const currentRound = await GameRound.findOne({game_key: game.key, round_number: game.current_round})
  io.in(game.key).emit('update', normalizeGameResponse(game, currentRound))
}
