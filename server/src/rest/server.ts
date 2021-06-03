import express, {Application, NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import { ServerOptions } from "../app";
import userRoute from "./user/route";
import gameRouter from "./game/route";
import {User} from "../db/user/models/User";
import cardRouter from "./card/route";
import {github} from "./githubhook";

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

declare module 'express' {
  export interface Request {
    rawBody: Buffer,
  }
}

/**
 * @param options Port and Host options to run rest server on
 *
 * Creates an Express rest server
 */
export function createRestServer(options: ServerOptions) {
  const app: Application = express()
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json({
    verify: (req: Request, res, buf) => {
      req.rawBody = buf
    }
  }))
  app.use(cookieParser())
  app.set('trust proxy', true)
  app.use(cors({origin: options.clientUrl, credentials: true}))
  app.use((_req, res, next) => {
    res.header({'Access-Control-Allow-Headers': options.clientUrl})
    next()
  })
  app.use(userSession)

  /**
   * Register routes
   */
  app.use('/user', userRoute)
  app.use('/game', gameRouter)
  app.use('/card', cardRouter)
  app.use('/deploy/github', github)

  return app
}
