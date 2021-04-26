import express, {Application} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import session, { Cookie } from "express-session";
import { User } from "../db/user/models/User";
import { ServerOptions } from "../app";
import userRoute from "./user/route";
import gameRouter from "./game/route";

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

/**
 * @param options Port and Host options to run rest server on
 *
 * Creates an Express rest server
 */
export function createRestServer(options: ServerOptions) {
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

  /**
   * Register routes
   */
  app.use('/user', userRoute)
  app.use('/game', gameRouter)
  return app
}
