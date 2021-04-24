import {Server} from "socket.io";
import {userSession} from "./app";
import http from "http";
import {ServerOptions} from "./server";

export function configuredIo(server: http.Server, options: ServerOptions) {
  const hostUri = `${options.host}:${options.port}`
  const io = new Server(server, {
    cors: {
      origin: hostUri,
      methods: ["GET", "POST"],
      allowedHeaders: [hostUri, "user"],
      credentials: true,
    },
    pingTimeout: 500,
    transports: ['websocket']
  })
  io.use((socket: any, next: any) => userSession(socket.request, {} as any, next))
  return io
}
