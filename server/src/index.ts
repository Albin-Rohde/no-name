import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import Raven from "raven";
import {initApp} from "./app";
import {User} from "./user/models/User";

dotenv.config({path: '../.env'});

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

/** custom attributes on express.Request object **/
declare module 'express' {
  export interface Request {
    /** uuid for tracking logs */
    tracingId: string
  }
}

/** Setup session for websockets **/
declare module 'http' {
  export interface IncomingMessage {
    session: {
      user: User
      save: (...args: any[]) => void
      destroy: (...args: any[]) => void
      readonly id: string,
    }
    /** uuid for tracking logs */
    tracingId: string
  }
}

initApp();