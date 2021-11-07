import * as http from "http";
import "reflect-metadata";
import dotenv from 'dotenv'
import { SocketWithSession } from "./globalTypes";
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
import cardDeckRouter from "./cardDeck/controller";
import logRouter from "./logger/controller";
import { flipCardEvent, playCardEvent, voteCardEvent } from "./card/events";
import {
  deleteGameEvent,
  getGameEvent,
  joinGameEvent,
  leaveGameEvent,
  nextRoundEvent,
  playAgainEvent,
  startGameEvent
} from "./game/events";
import {SocketServer} from "./lib/socket/Socket";

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
    maxAge: 1000 * 60 * 60 * 24, // (24 hours)
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
    registerRoutes(app)
    const httpServer = http.createServer(app)
    const io = new SocketServer(httpServer, {
      cors: {
        origin: options.clientUrl,
        methods: ["GET", "POST"],
        allowedHeaders: [options.clientUrl, "user"],
        credentials: true,
      },
      pingTimeout: 500,
      transports: ['websocket']
    })
    appendListeners(io)
    io.on('connection', (socket: SocketWithSession) => {
      io.subscribeListeners(socket)
      io.emit('connected')
    })
    httpServer.listen(options.port, () => {
      logger.info(`server started on port ${options.port}`)
    })
  } catch (err) {
    logger.error(err)
  }
}

function registerRoutes(app: Application) {
  app.use('/user', userRoute)
  app.use('/game', gameRouter)
  // TODO: rename this route to card-deck or something
  app.use('/card', cardDeckRouter)
  app.use('/logs', logRouter)
}

export enum Events {
  GET_GAME = 'get-game',
  JOIN_GAME = 'join-game',
  START_GAME = 'start-game',
  LEAVE_GAME = 'leave-game',
  DELETE_GAME = 'delete-game',
  PLAY_AGAIN = 'play-again',
  PLAY_CARD = 'play-card',
  FLIP_CARD = 'flip-card',
  VOTE_CARD = 'vote-card',
}

export const appendListeners = (io: SocketServer) => {
  io.addEventHandler(Events.JOIN_GAME, joinGameEvent)
  io.addEventHandler(Events.GET_GAME, getGameEvent)
  io.addEventHandler(Events.PLAY_AGAIN, playAgainEvent)
  io.addEventHandler(Events.START_GAME, startGameEvent)
  io.addEventHandler(Events.LEAVE_GAME, leaveGameEvent)
  io.addEventHandler(Events.DELETE_GAME, deleteGameEvent)
  io.addEventHandler(Events.PLAY_CARD, playCardEvent)
  io.addEventHandler(Events.FLIP_CARD, flipCardEvent)
  io.addEventHandler(Events.VOTE_CARD, voteCardEvent, nextRoundEvent)
}

startServer()
