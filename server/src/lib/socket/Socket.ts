import {Server, ServerOptions, Socket} from "socket.io";
import * as http from "http";
import {EventFunction, Middleware, OnceMiddleware, OnErrorHandler} from "./types";

interface Options {
  once?: OnceMiddleware[],
  beforeAll?: Middleware[],
  beforeEach?: Middleware[],
  onError?: OnErrorHandler,
}

export class SocketServer extends Server {
  private eventHandlerMap = new Map<string, EventFunction[]>();
  private readonly beforeAll: Middleware[];
  private readonly beforeEach: Middleware[];
  private readonly onError: OnErrorHandler;

  constructor(srv?: http.Server, opts?: Partial<ServerOptions>, options?: Options) {
    super(srv, opts);
    for (const once of options.once) {
      this.use(once);
    }
    this.beforeAll = options.beforeAll;
    this.beforeEach = options.beforeEach;
    this.onError = options.onError;
  }

  public subscribeListeners(socket: Socket): void {
    this.eventHandlerMap.forEach((handlers, event) => {
      socket.on(event, async (...args: unknown[]) => {
        try {
          for (const middleware of this.beforeAll) {
            await middleware(socket, {args, event});
          }
          for (const handler of handlers) {
            for (const middleware of this.beforeEach) {
              await middleware(socket, {args, event, handler: handler.name});
            }
            await handler(this, socket, ...args);
          }
        } catch (err) {
          await this.onError(socket, err);
        }
      });
    });
  }

  public addEventHandler(event: string, ...eventFns: EventFunction[]) {
    const handlers = this.eventHandlerMap.get(event);
    if (!handlers) {
      this.eventHandlerMap.set(event, eventFns);
      return;
    }
    this.eventHandlerMap.set(event, [...handlers, ...eventFns]);
  }
}
