import {Socket} from "socket.io"
import {User} from "../db/user/models/User";
import * as http from "http"

type Modify<T, R> = Omit<T, keyof R> & R;

export type SocketWithSession = Modify<Socket, {
  request: Modify<http.IncomingMessage, {
    session: {
      user: User
      save: () => void
    }
  }>
}>

export { createSocketServer } from './server'
export { GameRuleError, NotAllowedError, GameStateError } from './error'
