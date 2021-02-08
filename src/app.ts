import "reflect-metadata"
import http from 'http'
import { Socket, Server } from 'socket.io'
import sharedSession from 'express-socket.io-session'
import express, {Application, Request} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import {createConnection} from "typeorm";

import {User} from './user/models/User'

import userRoute from './user/route'
import gameRouter from "./game/route"
import { Game } from "./game/models/Game"

declare module 'express-session' {
  interface Session {
    user: User
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
  app.use((req, res, next) => {
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
  io.use(sharedSession(userSession))

  // Routes
  app.use('/user', userRoute)
  app.use('/game', gameRouter)
  
  io.on('connection', (socket) => {
    socket.on('join', async (key: string) => {
      const userId = socket.handshake.session?.user?.id
      if(!userId) {
        socket.disconnect()
      }
      try {
        const user = await User.findOneOrFail(userId)
        const game = await Game.findOneOrFail(key, {relations: ['users']})
        if(game.users.length === game.player_limit) {
          if(!game.users.some(u => u.id === user.id)) {
            return socket.disconnect()
          }
        }
        if(!game.users.some(u => u.id == user.id)) {
          game.users.push(user)
        }
        game.save()
        socket.join(key)
        io.in(game.key).emit('update', game)
      } catch(e) {}
    })
  })
  
  // Start server
  server.listen(5000, () => console.log(`Server started on port: 5000 `))
}).catch(error => console.log(error));
