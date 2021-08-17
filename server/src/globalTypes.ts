import {Server, Socket} from "socket.io";
import http from "http";
import {User} from "./user/models/User";
import {Game} from "./game/models/Game";

interface RestError {
  name: string
  message: string
  code?: string
}

export type RestResponse<T> = {
  ok: boolean
  err?: RestError
  data: T
}

type Modify<T, R> = Omit<T, keyof R> & R;

export type SocketWithSession = Modify<Socket, {
  request: Modify<http.IncomingMessage, {
    session: {
      user: User
      save: () => void
    }
  }>
}>

export type EventFunction<T> = (io: Server, socket: SocketWithSession, ...args: T[]) => Promise<Game | null>
export type EventFunctionWithGame<T> = (game: Game, ...args: T[]) => Promise<Game | null>
