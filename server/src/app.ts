import http from "http";
import { createSocketServer } from "./socket";
import { createRestServer } from "./rest";
import { createConnection } from "typeorm";

export interface ServerOptions {
  host: string
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
    host: process.env.host || 'http://localhost',
    port: Number(process.env.port) || 5000,
    clientUrl: process.env.clientUrl || 'http://localhost:3000',
  }
  createConnection().then(async () => {
    console.log('connected to db')
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
