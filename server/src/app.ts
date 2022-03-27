import * as http from "http";
import "reflect-metadata";
import express, {Application, RequestHandler} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import {SocketServer} from "./lib/socket/Socket";
import Raven from 'raven'
import {authSocketUser, loggerMiddleware, expressLoggingMiddleware} from "./middlewares";
import {emitErrorEvent} from "./socketEmitters";
import {RedisStore} from "connect-redis";
import {logger} from "./logger/logger";
import {Socket} from "socket.io";
import {appendListeners, registerRoutes} from "./routing";

export interface ServerOptions {
  port: number
  clientUrl: string
}

function getExpressApp(options: ServerOptions, session: RequestHandler): Application {
  const app: Application = express();
  /** Generic middlewares **/
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.set('trust proxy', true)
  app.use(cors({origin: options.clientUrl, credentials: true}));
  app.use((_req, res, next) => {
    res.header({'Access-Control-Allow-Headers': options.clientUrl});
    next();
  });
  /** Sentry middleware **/
  if (process.env.NODE_ENV === 'Production') {
    app.use(Raven.requestHandler());
    app.use(Raven.errorHandler());
  }
  /** logger middleware **/
  app.use(expressLoggingMiddleware);
  /** user session **/
  app.use(session)
  return app;
}

function getSocketServer(server: http.Server, options: ServerOptions, session: RequestHandler): SocketServer {
  /** Make express session available to socket **/
  const mapSession = (socket: any, next: any) => {
    session(socket.request, {} as any, next);
  }
  return new SocketServer(
      server,
      {
        cors: {
          origin: options.clientUrl,
          methods: ["GET", "POST"],
          allowedHeaders: [options.clientUrl, "user"],
          credentials: true,
        },
        pingTimeout: 500,
        transports: ['websocket']
      },
      {
        once: [mapSession],
        beforeAll: [authSocketUser],
        beforeEach: [loggerMiddleware],
        onError: emitErrorEvent,
      }
    );
}

function initApp(redisStore: RedisStore) {
  const userSession = session({
    store: redisStore,
    name: 'sid',
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: false,
      sameSite: false,
    }
  });
  const options: ServerOptions = {
    port: Number(process.env.PORT),
    clientUrl: process.env.CLIENT_URL!,
  }
  const app = getExpressApp(options, userSession);
  registerRoutes(app);
  const server = http.createServer(app);
  const socketServer = getSocketServer(http.createServer(app), options, userSession);
  appendListeners(socketServer);
  socketServer.on('connection', (socket: Socket) => {
    socketServer.subscribeListeners(socket);
    socket.emit('connected');
  })
  server.listen(options.port, () => {
    logger.info(`server started on port ${options.port}`)
  });
}

export {initApp};