import { Server, Socket } from "socket.io";
import { userSession } from "../rest/server";
import http from "http";
import { ServerOptions } from "../app";
import { authSocketUser } from "./authenticate";
import { registerSocketEvents } from "./events/register";

export function createSocketServer(server: http.Server, options: ServerOptions) {
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
  io.on('connection', async (socket: Socket) => {
    io.use((socket: Socket, next: any) => authSocketUser(socket, io, next))
    registerSocketEvents(io, socket)
    socket.emit('connected')
  })
  return io
}