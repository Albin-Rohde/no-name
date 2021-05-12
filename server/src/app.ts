import * as http from "http";
import "reflect-metadata";
import dotenv from 'dotenv'
import { createSocketServer } from "./socket";
import { createRestServer } from "./rest";
import { createConnection } from "typeorm";

dotenv.config()

export interface ServerOptions {
  port: number
  clientUrl: string
}

/**
 * Start the web server
 * Will start one express rest server
 * Will start one socket.io websocket server
 */
function startServer() {
  const options: ServerOptions = {
    port: Number(process.env.PORT),
    clientUrl: process.env.CLIENT_URL,
  }
  createConnection().then(async () => {
    console.log('connected to db')
    console.log(options)
    const server = createServer(options)
    server.listen(options.port, () => {
      console.log(`server started on port ${options.port}`)
    })
  }).catch((err) => console.log(err))
}

/**
 * Returns a configured server instance to run
 * an express rest app and a socket io
 * websocket server
 */
function createServer(options: ServerOptions): http.Server {
  /**
   * app: Configured express app for rest
   * server: http server that will run everything
   * io: websocket server
   */
  const app = createRestServer(options)
  const server = http.createServer(app)
  createSocketServer(server, options)
  return server
}

/**
 * Run to start app
 */
startServer()
