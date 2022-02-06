import {Server, Socket} from "socket.io";

export type EventFunction = (io: Server, socket: Socket, ...args: unknown[]) => Promise<void>
export type OnceMiddleware = (socket: Socket, ...args: unknown[]) => void
export type MiddlewareMetaData = {
  event: string,
  args: unknown[],
  handler?: string,
}
export type Middleware = (socket: Socket, meta: MiddlewareMetaData) => unknown
export type OnErrorHandler = (socket: Socket, error: Error) => unknown