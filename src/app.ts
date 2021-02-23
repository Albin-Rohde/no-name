import "reflect-metadata"
import http from 'http'
import { Socket, Server } from 'socket.io'
import express, {Application} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import {createConnection} from "typeorm";

import {User} from './user/models/User'

import userRoute from './user/route'
import gameRouter from "./game/route"
import { joinGameEvent, playCardEvent, startGameEvent } from "./game/socket"
import addWhiteCardsToDb from "./scripts/populate"
import { authSocketUser } from "./authenticate"

declare module 'http' {
	interface IncomingMessage {
		session: {
			user: User,
			[propName: string]: any
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
      origin: "http://localhost",
      methods: ["GET", "POST"],
      allowedHeaders: ["http://localhost", "user"],
      credentials: true
    }
  })
  
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.set('trust proxy', true)
  app.use(cors({origin: 'http://localhost',credentials: true}))
  app.use((_req, res, next) => {
    res.header({'Access-Control-Allow-Headers': 'http://localhost'})
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

	const expressResponse: any = {}
  io.use((socket: any, next: any) => userSession(socket.request, expressResponse, next))

  // Routes
  app.use('/user', userRoute)
  app.use('/game', gameRouter)
  
	io.use(authSocketUser)
  io.on('connection', async (socket: Socket) => {
    socket.on('join', (key: string) => joinGameEvent(io, socket, key))
		socket.on('start', () => startGameEvent(io, socket))
		socket.on('play-card', (cardId: number) => playCardEvent(io, socket, cardId))
	})

	// Set up db
	addWhiteCardsToDb()
  // Start server
  server.listen(5000, () => console.log(`Server started on port: 5000 `))
}).catch(error => console.log(error));
