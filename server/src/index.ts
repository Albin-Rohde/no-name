import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import Raven from "raven";
import connectRedis, {RedisStore} from "connect-redis";
import session from "express-session";
import redis from "redis";
import {logger} from "./logger/logger";
import {initApp} from "./app";
import {createConnection} from "typeorm";
import {User} from "./user/models/User";

dotenv.config({path: '.env'});

/** Setup for sentry **/
declare global {
  namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
}
global.__rootdir__ = __dirname || process.cwd();
if (process.env.NODE_ENV == 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
  Raven.config(process.env.SENTRY_DSN).install();
}

/** Setup for express-session **/
declare module 'express-session' {
  export interface SessionData {
    user: User // This is what we store with the session
    save: (...args: any[]) => void
    destroy: (...args: any[]) => void
  }
}

/** Setup session for websockets **/
declare module 'http' {
  export interface IncomingMessage {
    session: {
      user: User
      save: (...args: any[]) => void
      destroy: (...args: any[]) => void
    }
  }
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

async function connectPostgres(): Promise<void> {
  await createConnection();
}

async function init() {
  const redisStore = getRedisSessionStore();
  await connectPostgres()
  initApp(redisStore);
}

init();