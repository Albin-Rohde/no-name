import http from "http";
import {Application} from "express";
import {Server, Socket} from "socket.io";
import {configuredIo} from "./io";
import {configuredApp} from "./app";
import userRoute from "../user/route";
import gameRouter from "../game/route";
import {registerSocketEvents} from "../socket/register";
import {authSocketUser} from "../user/authenticate";
import {createConnection} from "typeorm";

export interface ServerOptions {
  host: string
  port: number
}

/**
 * Start the web server
 * Will start one express rest server
 * Will start one socket.io websocket server
 */
export function startServer() {
  const options = {
    host: process.env.host || 'http://localhost',
    port: Number(process.env.port) || 5000,
  }
  createConnection().then(async () => {
    console.log('connected to db')
    const server = configuredServer(options)
    server.listen(options.port, () => `server started on port ${options.port}`)
  }).catch((err) => console.log(err))
}

/**
 * Returns a configured server instance to run
 * an express rest app and a socket io
 * websocket server
 */
export function configuredServer(options: ServerOptions): http.Server {
  /**
   * app: Configured express app for rest
   * server: http server that will run everything
   * io: websocket server
   */
  const app = configuredApp(options)
  const server = http.createServer(app)
  const io = configuredIo(server, options)

  registerRestRoutes(app)
  registerEvents(io)
  return server
}

/**
 * register rest endpoints for app
 */
function registerRestRoutes(app: Application) {
  app.use('/user', userRoute)
  app.use('/game', gameRouter)
}

/**
 * register socket events for io
 */
function registerEvents(io: Server) {
  io.on('connection', async (socket: Socket) => {
    io.use((socket: Socket, next: any) => authSocketUser(socket, io, next))
    registerSocketEvents(io, socket)
    socket.emit('connected')
  })
}
