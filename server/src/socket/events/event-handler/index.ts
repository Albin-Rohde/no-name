import {Server} from "socket.io";
import {Game} from "../../../db/game/models/Game";
import {SocketWithSession} from "../../index";

export enum Events {
  GET_GAME = 'get-game',
  JOIN_GAME = 'join',
  START_GAME = 'start',
  LEAVE_GAME = 'leave-game',
  PLAY_CARD = 'play-card',
  FLIP_CARD = 'flip-card',
  VOTE_CARD = 'vote-card',
}

export type EventFunction<T> = (io: Server, socket: SocketWithSession, ...args: T[]) => Promise<Game | null>

export type EventFunctionWithGame<T> = (game: Game, ...args: T[]) => Promise<Game>

export { getGameEvent, joinGameEvent, startGameEvent, leaveGameEvent } from './game'

export { playCardEvent, flipCardEvent, voteCardEvent } from './card'
