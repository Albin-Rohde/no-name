import express, {Application} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import session, {Cookie} from "express-session";
import {User} from "../user/models/User";
import {ServerOptions} from "./server";

declare module 'http' {
  interface IncomingMessage {
    session: {
      user: User
      id: string
      cookie: Cookie
      regenerate: ((err?: any) => void)
      destroy: ((err?: any) => void)
      reload: ((err?: any) => void)
      resetMaxAge: () => void
      save: ((err?: any) => void)
      touch: () => void
    }
  }
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

export function configuredApp(options: ServerOptions) {
  const hostUri = `${options.host}:${options.port}`
  const app: Application = express()
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.set('trust proxy', true)
  app.use(cors({origin: hostUri,credentials: true}))
  app.use((_req, res, next) => {
    res.header({'Access-Control-Allow-Headers': hostUri})
    next()
  })
  app.use(userSession)
  return app
}
