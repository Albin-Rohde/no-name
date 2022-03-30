import {Server, Socket} from "socket.io";
import { normalizeGameResponse } from "./socketResponse";
import { Game } from "./game/models/Game";
import {GameRuleError, WrappedError} from "./error";
import { logger } from "./logger/logger";

enum EventType {
  UPDATE = 'update',
  REMOVED = 'removed',
  NOTIFICATION = 'notification',
  RULE_ERROR = 'rule_error',
  SERVER_ERROR = 'server_error',
}

/**
 * Emits an update event with the game supplied
 * Saves the updated game to db before exit.
 */
export async function emitUpdateEvent(io: Server, game: Game): Promise<void> {
  await Promise.all(game.users.map(u => u.save()))
  await game.save()
  io.in(game.key).emit(EventType.UPDATE, normalizeGameResponse(game))
}

/**
 * Emits a removed event to all clients connected to game
 * current socket will leave the socket room.
 */
export async function emitRemovedEvent(io: Server, socket: Socket, game: Game): Promise<void> {
  socket.leave(game.key)
  io.in(game.key).emit(EventType.REMOVED, game.key)
}

export async function emitNotificationsEvent(io: Server, socket: Socket, message: string) {
  const gameKey = socket.request.session.user.game_fk;
  io.in(gameKey).emit(EventType.NOTIFICATION, message);
}

/**
 * Error catcher for all errors thrown by socket eventHandlers
 */
export async function emitErrorEvent(socket: Socket, err: Error): Promise<void> {
  if (err instanceof GameRuleError) {
    err.extra = {userId: socket.request?.session?.user?.id}
    logger.warn('Socket Error', err)
    socket.emit(EventType.RULE_ERROR, err.message)
  } else {
    err = new WrappedError(err, {userId: socket.request?.session?.user?.id});
    logger.error('Socket Error', err)
    socket.emit(EventType.SERVER_ERROR, 'Internal Server Error')
  }
}
