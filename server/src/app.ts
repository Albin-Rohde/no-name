import * as http from "http";
import "reflect-metadata";
import dotenv from 'dotenv'
import { SocketWithSession } from "./types";
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
import { flipCardEvent, playCardEvent, voteCardEvent } from "./card/events";
import {
  deleteGameEvent,
  getGameEvent,
  joinGameEvent,
  leaveGameEvent,
  nextRoundEvent,
  notifyCardWizzEvent,
  playAgainEvent,
  startGameEvent
} from "./game/events";
import {SocketServer} from "./lib/socket/Socket";
import * as Sentry from "@sentry/node";
import Raven from 'raven'
import redis from 'redis'
import connectRedis from 'connect-redis'

dotenv.config({path: '.env'})

/** Sentry config **/
// This allows TypeScript to detect our global value
declare global {
  namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
}
global.__rootdir__ = __dirname || process.cwd();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
Raven.config(process.env.SENTRY_DSN).install();

export interface ServerOptions {
  port: number
  clientUrl: string
}
const RedisStore = connectRedis(session)
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379
})
redisClient.on('error', function (err) {
  logger.error('Could not establish a connection with redis.' + err);
});
redisClient.on('connect', function (err) {
  logger.info('Connected to redis successfully');
});

export const userSession = session({
  store: new RedisStore({ client: redisClient }),
  name: 'sid',
  secret: process.env.COOKIE_SECRET,
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
    app.use(Raven.requestHandler())
    app.use(userSession)
    app.use(expressLogger)
    registerRoutes(app)
    app.use(Raven.errorHandler());
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
  app.get('/health', (_req, res) => {
    res.status(200).send("OK");
  })
  app.use('/user', userRoute)
  app.use('/game', gameRouter)
  // TODO: rename this route to card-deck or something
  app.use('/card', cardRouter)
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
  io.addEventHandler(Events.VOTE_CARD, voteCardEvent, nextRoundEvent, notifyCardWizzEvent)
}

startServer()
