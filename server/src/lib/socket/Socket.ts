import {SocketWithSession} from "../../globalTypes";
import {Server, ServerOptions} from "socket.io";
import * as http from "http";
import {userSession} from "../../app";
import {EventFunction} from "./types";
import {authSocketUser, loggerMiddleware} from "../../middlewares";
import {emitErrorEvent} from "../../socketEmitters";

export class SocketServer extends Server {
  private eventHandlerMap = new Map<string, EventFunction[]>();

  constructor(srv?: http.Server, opts?: Partial<ServerOptions>) {
    super(srv, opts);
    this.use((socket: any, next: any) => userSession(socket.request, {} as any, next))
  }

  public subscribeListeners(socket: SocketWithSession): void {
    this.eventHandlerMap.forEach((handlers, event) => {
      socket.on(event, async (...args: unknown[]) => {
        try {
          await authSocketUser(socket);
          for (const handler of handlers) {
            loggerMiddleware(socket, {
              eventName: event,
              eventMethod: handler.name,
              arguments: args,
              userId: socket.request.session.user.id,
              gameId: socket.request.session.user.game_fk,
            })
            await handler(this, socket, ...args);
          }
        } catch (err) {
          await emitErrorEvent(err, socket);
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
