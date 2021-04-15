import "reflect-metadata"
import http from 'http'
import { Socket, Server } from 'socket.io'
import express, {Application} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session, {Cookie} from 'express-session'
import {createConnection} from "typeorm";

import {User} from './user/models/User'

import userRoute from './user/route'
import gameRouter from "./game/route"
import { registerSocketEvents } from "./socket/events"
import addWhiteCardsToDb from "./scripts/populate"
import {authSocketUser} from "./authenticate";

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

// Set up app
createConnection().then(async () => {
  console.log('connection to db established')
  const app: Application = express()
  const server = http.createServer(app)
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["http://localhost:3000", "user"],
      credentials: true,
    },
    pingTimeout: 500,
    transports: ['websocket']
  })
  
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.set('trust proxy', true)
  app.use(cors({origin: 'http://localhost:3000',credentials: true}))
  app.use((_req, res, next) => {
    res.header({'Access-Control-Allow-Headers': 'http://localhost:3000'})
    next()
  })
  const userSession = session({
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
  app.use(userSession)

  io.use((socket: any, next: any) => userSession(socket.request, {} as any, next))

  // Routes
  app.use('/user', userRoute)
  app.use('/game', gameRouter)
  
  io.on('connection', async (socket: Socket) => {
    io.use((socket: Socket, next: any) => authSocketUser(socket, io, next))
    registerSocketEvents(io, socket)
    socket.emit('connected')
  })

  // Set up db
  await addWhiteCardsToDb()
  // Start server
  server.listen(5000, () => console.log(`Server started on port: 5000 `))
}).catch(error => console.log(error))
