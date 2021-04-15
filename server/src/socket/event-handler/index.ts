import {Server, Socket} from "socket.io";
import {Game} from "../../game/models/Game";

export enum Events {
  GET_GAME = 'get-game',
  JOIN = 'join',
  START = 'start',
  LEAVE_GAME = 'leave-game',
  PLAY_CARD = 'play-card',
  FLIP_CARD = 'flip-card',
  VOTE_CARD = 'vote-card',
}

export type EventFunction<T> = (io: Server, socket: Socket, ...args: T[]) => Promise<Game>