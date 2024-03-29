import * as http from "http";
import "reflect-metadata";
import express, {Application, RequestHandler, static as express_static, Router} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import {SocketServer} from "./lib/socket/Socket";
import Raven from 'raven'
import {
  authSocketUser,
  loggerMiddleware,
  expressLoggingMiddleware,
  initTracingId,
  initTracingIdSocket
} from "./middlewares";
import {emitErrorEvent} from "./socketEmitters";
import connectRedis, {RedisStore} from "connect-redis";
import {logger} from "./logger/logger";
import {Socket} from "socket.io";
import {appendListeners, registerRoutes} from "./routing";
import redis from "redis";
import {createConnection} from "typeorm";
import {engine} from "express-handlebars";
import path from "path";
import {isStringTrue, typeIsBool} from "./admin/hbsHelpers";

export interface ServerOptions {
  port: number
  clientUrl?: string
}

function getExpressApp(options: ServerOptions, session: RequestHandler): Application {
  const app: Application = express();
  /** Handlebars engine **/
  app.set('views', path.join(__dirname, './admin', 'views'))
  app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
    helpers: {typeIsBool, isStringTrue}
  }));
  app.set('view engine', 'hbs');
  /** Generic middlewares **/
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.set('trust proxy', true)
  app.use(cors({
      origin: options.clientUrl,
      credentials: true,
      methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  }));
  app.use((_req, res, next) => {
    if (options.clientUrl) {
      res.header({'Access-Control-Allow-Headers': options.clientUrl});
    }
    next();
  });
  /** Sentry middleware **/
  if (process.env.NODE_ENV === 'Production') {
    app.use(Raven.requestHandler());
    app.use(Raven.errorHandler());
  }
  /** logger middleware **/
  app.use(initTracingId);
  app.use(expressLoggingMiddleware);
  /** user session **/
  app.use(session)
  /** register routes **/
  registerRoutes(app);
  return app;
}

function getHttpServer(app: Application, options: ServerOptions, session: RequestHandler): http.Server {
  const httpServer = http.createServer(app);
  addSocketServer(httpServer, options, session);
  return httpServer;
}

function addSocketServer(server: http.Server, options: ServerOptions, session: RequestHandler): void {
  /** Make express session available to socket **/
  const mapSession = (socket: any, next: any) => {
    session(socket.request, {} as any, next);
  }
  const socketServer = new SocketServer(
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
        beforeAll: [authSocketUser, initTracingIdSocket],
        beforeEach: [loggerMiddleware],
        onError: emitErrorEvent,
      }
    );
  /** add event listeners **/
  appendListeners(socketServer);
  /** handle initial connection **/
  socketServer.on('connection', (socket: Socket) => {
    socketServer.subscribeListeners(socket);
    socket.emit('connected');
  });
}

function getRedisSessionStore(): RedisStore {
  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: Number.parseInt(process.env.REDIS_PORT) || 6379
  });
  redisClient.on('error', (err) => {
    logger.error('Could not establish a connection with redis.', err);
  });
  redisClient.on('connect', (_err) => {
    logger.info('Connected to redis successfully');
  });
  const connectedRedis = connectRedis(session);
  return new connectedRedis({client: redisClient});
}

async function initApp() {
  const options: ServerOptions = {
    port: Number(process.env.PORT || 5000),
    clientUrl: process.env.CLIENT_URL || undefined,
  }
  await createConnection();
  logger.info(`Connected to postgres successfully`)
  const store = getRedisSessionStore();
  const userSession = session({
    store,
    name: 'sid',
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production',
    }
  });
  const app = getExpressApp(options, userSession);

  // Serve react app if in production
  if (process.env.NODE_ENV === "production") {
    const reactRouter = Router();
    const staticPath = path.join(__dirname, "..", "..", "frontend", "build")
    const reactStatic = express_static(staticPath)
    const reactPaths = [
      "/",
      "/reset",
      "/join",
      "/home",
    ]
    reactPaths.forEach((path) => {
      reactRouter.use(path, reactStatic)
    })
    app.use("/", reactRouter);
  }
  const server = getHttpServer(app, options, userSession);
  server.listen(options.port, () => {
    logger.info(`server started on port ${options.port}`)
  });
}

export {initApp};