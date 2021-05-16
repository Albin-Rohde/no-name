import {io, Socket} from "socket.io-client";
import type {CardResponse, GameSocketResponse, UserResponse} from "./ResponseTypes";
import {CardState} from "./ResponseTypes";
import { HandleError } from "../utils/decorator";
import autoBind from "auto-bind";
// @ts-ignore
import * as process from "process";

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
  private readonly baseUrl: string = process.env.API_BASE_URL
  public socket: Socket
  public game: GameSocketResponse
  public currentUser: UserResponse

  constructor(user: UserResponse) {
    this.currentUser = user
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
      this.game = game
      this.currentUser = game.users.find(user => user.id === this.currentUser.id)
      rerenderCb()
    })
    this.socket.on('removed', (gameKey: string) => {
      console.log(`game with key ${gameKey} has been removed by host`)
      this.socket.disconnect()
    })
    this.socket.on('disconnect', () => {
      this.socket = undefined
      this.game = undefined
      this.currentUser = undefined
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

  private get allPlayers() {
    return this.game.users.filter(user => !user.cardWizz)
  }

  private get allUsersPlayed() {
    return this.allPlayers.every(user => user.hasPlayed)
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
    if(!this.currentUser.hasPlayed) {
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
    if(!this.allUsersPlayed) {
      throw new Error('All user must play before flipping')
    }
    this.socket.emit(Events.FLIP_CARD, card.id)
  }

  @HandleError
  public voteCard(card: CardResponse) {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    if(!this.allUsersPlayed) {
      throw new Error('All user must play before voting')
    }
    const allCards = this.allPlayers.flatMap(user => user.cards)
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
