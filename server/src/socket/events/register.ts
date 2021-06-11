import {Server} from "socket.io";
import {
  deleteGameEvent,
  EventFunction,
  EventFunctionWithGame,
  Events,
  flipCardEvent,
  getGameEvent,
  joinGameEvent,
  leaveGameEvent,
  playCardEvent,
  startGameEvent,
  voteCardEvent,
} from './event-handler'
import { Game } from "../../db/game/models/Game";
import { normalizeGameResponse } from "./response";
import { getGameFromUser } from "../../db/game/services";
import { GameRuleError } from "../error";
import { SocketWithSession } from "../index";
import {authSocketUser, loggerMiddleware} from "../authenticate";
import {logger} from "../../logger";

/**
 * Register events to the socket
 *
 * Handles any error the eventHandler might throw
 *
 * @param io Socket.io Server instance
 * @param socket Socket.io Socket
 */
export const registerSocketEvents = (io: Server, socket: SocketWithSession) => {
  addListener<string>(io, socket, Events.JOIN_GAME, joinGameEvent)
  addListener<never>(io, socket, Events.GET_GAME, getGameEvent)
  addListenerWithGame<never>(io, socket, Events.START_GAME, startGameEvent)
  addListenerWithGame<never>(io, socket, Events.LEAVE_GAME, leaveGameEvent)
  addListenerWithGame<never>(io, socket, Events.DELETE_GAME, deleteGameEvent)

  addListenerWithGame<number>(io, socket, Events.PLAY_CARD, playCardEvent)
  addListenerWithGame<number>(io, socket, Events.FLIP_CARD, flipCardEvent)
  addListener<number>(io, socket, Events.VOTE_CARD, voteCardEvent)
}

/**
 * takes an eventFunction wrap in in an error handler
 * register the handler on the socket as an eventListener
 *
 * The response from the eventFunction <Game> will be sent
 * to the client as an update event on every successfully event
 *
 * fetches a new Game instance on every event and send it in
 * as argument to the eventFunction
 *
 * @param io Socket.io Server instance
 * @param socket Socket.io Socket
 * @param event event string to listen for
 * @param eventFn eventHandlerFunction
 */
const addListenerWithGame = <T>(
  io: Server,
  socket: SocketWithSession,
  event: Events,
  eventFn: EventFunctionWithGame<T>,
): void => {
  async function eventCallback(...args: T[]) {
    try {
      loggerMiddleware(socket, {
        eventName: event,
        eventMethod: eventFn.name,
        arguments: args,
        userId: socket.request.session.user.id,
        gameId: socket.request.session.user.game_fk,
      })
      const user = await authSocketUser(socket)
      const g = await getGameFromUser(user.id)
      await eventFn(g, ...args)
        .then((game) => {
          if (game) {
            return emitUpdateEvent(io, game)
          }
          emitRemovedEvent(io, socket, g)
        })
    } catch (err) {
      handleError(err, socket)
    }
  }
  socket.on(event, eventCallback)
}

/**
 * takes an eventFunction wrap in in an error handler
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
  socket: SocketWithSession,
  event: Events,
  eventFn: EventFunction<T>,
): void => {
  async function eventCallback(...args: T[]) {
    try {
      loggerMiddleware(socket, {
        eventName: event,
        eventMethod: eventFn.name,
        arguments: args,
        userId: socket.request.session.user.id,
        gameId: socket.request.session.user.game_fk,
      })
      await eventFn(io, socket, ...args)
        .then((game) => game ? emitUpdateEvent(io, game) : null)
    } catch (err) {
      handleError(err, socket)
    }
  }
  socket.on(event, eventCallback)
}

/**
 * Emits an update event with the game supplied
 * Saves the updated game to db before exit.
 *
 * @param io
 * @param game
 */
export const emitUpdateEvent = async (io: Server, game: Game): Promise<void> => {
  await Promise.all(game.users.map(u => u.save()))
  await game.save()
  io.in(game.key).emit('update', normalizeGameResponse(game))
}

/**
 * Emits a removed event to all clients connected to game
 * current socket will leave the socket room.
 * @param io
 * @param socket
 * @param game
 */
const emitRemovedEvent = async (io: Server, socket: SocketWithSession, game: Game): Promise<void> => {
  socket.leave(game.key)
  io.in(game.key).emit('removed', game.key)
}

/**
 * Error catcher for all errors thrown by socket eventHandlers
 * @param err
 * @param socket
 */
export const handleError = (err: Error, socket: SocketWithSession) => {
  if (err instanceof GameRuleError) {
    logger.warn(err)
    socket.emit('rule_error', err.message)
  } else {
    logger.error('socket_server_error', err)
    socket.emit('server_error', 'Internal Server Error')
  }
}
