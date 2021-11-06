import {Socket} from "socket.io";
import http from "http";
import {User} from "./user/models/User";

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
