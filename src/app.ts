import "reflect-metadata"
import express, {Application} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import {createConnection} from "typeorm";

import {User} from './user/models/User'

import userRoute from './user/route'
import gameRouter from "./game/route"

declare module "express-session" {
  interface Session {
    user: User
  }
}

createConnection().then(async () => {
  console.log('connection to db established')
  const app: Application = express()
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.set('trust proxy', true)
  app.use(cors({origin: 'http://localhost',credentials: true}))
  app.use((req, res, next) => {
    res.header({'Access-Control-Allow-Headers': 'http://localhost'})
    next()
  })
  
  app.use(session({
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
  }))

  app.use('/user', userRoute)
  app.use('/game', gameRouter)
  

  app.listen(5000, () => console.log(`Server started on port: 5000 `))
}).catch(error => console.log(error));
