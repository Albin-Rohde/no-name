import { Server } from "socket.io";
import { SocketWithSession } from "./globalTypes";
import { EventFunction, EventFunctionWithGame, Events } from "./socket/events/event-handler";
import { normalizeGameResponse } from "./socketResponse";
import { authSocketUser, loggerMiddleware } from "./middlewares";
import { Game } from "./game/models/Game";
import { GameRuleError } from "./error";
import { logger } from "./logger/logger";
import { getGameFromUser } from "./game/services";

/**
 * takes an eventFunction(s) wrap it in an error handler
 * register the handler on the socket as an eventListener(s)
 *
 * The response from the eventFunction <Game> will be sent
 * to the client as an update event on every successfully event
 *
 * fetches a new Game instance on every event and send it in
 * as argument to the eventFunction(s)
 *
 * eventFunctions will be executed in the same order as supplied
 *
 * @param io Socket.io Server instance
 * @param socket Socket.io Socket
 * @param event event string to listen for
 * @param eventFns eventHandlerFunctions
 */
export const addListenersWithGame = <T>(
  io: Server,
  socket: SocketWithSession,
  event: Events,
  eventFns: EventFunctionWithGame<T>[],
): void => {
  async function eventCallback(...args: T[]) {
    try {
      const user = await authSocketUser(socket)
      for (const fn of eventFns) {
        loggerMiddleware(socket, {
          eventName: event,
          eventMethod: fn.name,
          arguments: args,
          userId: socket.request.session.user.id,
          gameId: socket.request.session.user.game_fk,
        })
        const g = await getGameFromUser(user.id)
        const game = await fn(g, ...args)
        game ? await emitUpdateEvent(io, game) : await emitRemovedEvent(io, socket, g)
      }
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
export const addListener = <T>(
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
export const emitRemovedEvent = async (io: Server, socket: SocketWithSession, game: Game): Promise<void> => {
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
