import { Server } from "socket.io";
import { SocketWithSession } from "./types";
import { normalizeGameResponse } from "./socketResponse";
import { Game } from "./game/models/Game";
import { GameRuleError } from "./error";
import { logger } from "./logger/logger";

/**
 * Emits an update event with the game supplied
 * Saves the updated game to db before exit.
 */
export async function emitUpdateEvent(io: Server, game: Game): Promise<void> {
  await Promise.all(game.users.map(u => u.save()))
  await game.save()
  io.in(game.key).emit('update', normalizeGameResponse(game))
}

/**
 * Emits a removed event to all clients connected to game
 * current socket will leave the socket room.
 */
export async function emitRemovedEvent(io: Server, socket: SocketWithSession, game: Game): Promise<void> {
  socket.leave(game.key)
  io.in(game.key).emit('removed', game.key)
}

/**
 * Error catcher for all errors thrown by socket eventHandlers
 */
export async function emitErrorEvent(socket: SocketWithSession, err: Error): Promise<void> {
  if (err instanceof GameRuleError) {
    logger.warn('Socket Error', err)
    socket.emit('rule_error', err.message)
  } else {
    logger.error('Socket Error', err)
    socket.emit('server_error', 'Internal Server Error')
  }
}
