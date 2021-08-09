import {io, Socket} from "socket.io-client";
import type {CardResponse, GameSocketResponse, UserResponse} from "./ResponseTypes";
import {CardState} from "./ResponseTypes";
import { HandleError } from "../utils/decorator";
import autoBind from "auto-bind";
// @ts-ignore
import * as process from "process";
import Game from "./Game";

type RerenderCallback = (disconnect?: boolean) => any

enum Events {
  GET_GAME = 'get-game',
  JOIN = 'join-game',
  START = 'start-game',
  LEAVE_GAME = 'leave-game',
  DELETE_GAME = 'delete-game',
  PLAY_CARD = 'play-card',
  FLIP_CARD = 'flip-card',
  VOTE_CARD = 'vote-card',
}

export class SocketClient {
  private readonly baseUrl: string = process.env.API_SOCKET_URL
  public socket: Socket
  private game: Game

  constructor(user: UserResponse) {
    this.game = new Game(user)
    autoBind(this)
  }

  public connect = async (rerenderCb: RerenderCallback): Promise<void> => {
    this.socket = io(this.baseUrl, {
      withCredentials: true,
      transports: ['websocket'],
      timeout: 500,
      reconnection: false,
      upgrade: true,
    })
    // socket event listeners
    this.socket.on('update', (game: GameSocketResponse) => {
      this.game.update(game)
      rerenderCb()
    })
    this.socket.on('removed', (gameKey: string) => {
      console.log(`game with key ${gameKey} has been removed by host`)
      this.socket.disconnect()
    })
    this.socket.on('disconnect', () => {
      this.socket = undefined
      this.game = undefined
      rerenderCb(true)
    })
    this.socket.on('connection_error', (err: string) => {
      console.error('connection error: ', err)
    })
    this.socket.on('server_error', (err: string) => {
      console.error('server_error: ', err)
    })
    this.socket.on('rule_error', (err: string) => {
      console.error('rule_error: ', err)
    })
    return new Promise(resolve => {
      this.socket.on('connected', () => {
        resolve()
      })
    })
  }

  public get gameData(): Game {
    return this.game
  }

  @HandleError
  public getGame() {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    this.socket.emit(Events.GET_GAME)
  }

  @HandleError
  public joinGame(key: string = this.game.key) {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    if(!key) throw new Error('No gameKey specified.')
    this.socket.emit(Events.JOIN, key)
  }

  @HandleError
  public startGame() {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    this.socket.emit(Events.START)
  }

  @HandleError
  public playCard(card: CardResponse) {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    if(!this.game.currentUser.hasPlayed) {
      this.socket.emit(Events.PLAY_CARD, card.id)
    }
  }

  @HandleError
  public flipCard(card: CardResponse) {
    if(!this.socket) {
      throw new Error('InGameClient not connected to socket.')
    }
    if(card.state === CardState.PLAYED_SHOW) {
      throw new Error('Card is already flipped')
    }
    if(!this.game.players.every(user => user.hasPlayed)) {
      throw new Error('All user must play before flipping')
    }
    this.socket.emit(Events.FLIP_CARD, card.id)
  }

  @HandleError
  public voteCard(card: CardResponse) {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    if(!this.game.players.every(user => user.hasPlayed)) {
      throw new Error('All user must play before voting')
    }
    const allCards = this.game.players.flatMap(user => user.cards)
    if(allCards.some(card => card.state === CardState.PLAYED_HIDDEN)) {
      throw new Error('All cards must be flipped before vote')
    }
    this.socket.emit(Events.VOTE_CARD, card.id)
  }

  @HandleError
  public leaveGame() {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    this.socket.emit(Events.LEAVE_GAME)
    this.socket.disconnect()
  }

  @HandleError
  public deleteGame() {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    this.socket.emit(Events.DELETE_GAME)
    this.socket.disconnect()
  }
}
