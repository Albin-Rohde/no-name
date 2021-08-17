import * as http from "http";
import "reflect-metadata";
import dotenv from 'dotenv'
import { createSocketServer } from "./socket";
import { createConnection } from "typeorm";
import { logger, expressLogger } from "./logger/logger";
import express, {Application} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";

import {User} from "./user/models/User";

import userRoute from "./user/controller";
import gameRouter from "./game/controller";
import cardRouter from "./card/controller";
import logRouter from "./logger/controller";

dotenv.config({path: '.env'})

export interface ServerOptions {
  port: number
  clientUrl: string
}

export const userSession = session({
  name: 'sid',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 864000,
    httpOnly: false,
    sameSite: false,
  }
})

declare module 'express-session' {
  export interface SessionData {
    user: User
    destroy: () => void
    save: () => void
  }
}


/**
 * Start the web server
 * Will start one express rest server
 * Will start one socket.io websocket server
 */
async function startServer() {
  const options: ServerOptions = {
    port: Number(process.env.PORT),
    clientUrl: process.env.CLIENT_URL!,
  }
  try {
    await createConnection()
    logger.info('Connected to db')
    logger.debug(options)
    const app = createRestServer(options)
    const server = http.createServer(app)
    createSocketServer(server, options)
    server.listen(options.port, () => {
      logger.info(`server started on port ${options.port}`)
    })
  } catch (err) {
    logger.error(err)
  }
}

function createRestServer(options: ServerOptions) {
  const app: Application = express()
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.set('trust proxy', true)
  app.use(cors({origin: options.clientUrl, credentials: true}))
  app.use((_req, res, next) => {
    res.header({'Access-Control-Allow-Headers': options.clientUrl})
    next()
  })
  app.use(userSession)
  app.use(expressLogger)

  /**
   * Register routes
   */
  app.use('/user', userRoute)
  app.use('/game', gameRouter)
  app.use('/card', cardRouter)
  app.use('/logs', logRouter)
  return app
}

/**
 * Run to start app
 */
startServer()
