import {io, Socket} from "socket.io-client";
import type {CardResponse, GameSocketResponse, UserResponse} from "./ResponseTypes";
import {CardState} from "./ResponseTypes";

enum Events {
  GET_GAME = 'get-game',
  JOIN = 'join',
  START = 'start',
  PLAY_CARD = 'play-card',
  FLIP_CARD = 'flip-card',
  VOTE_CARD = 'vote-card',
  LEAVE_GAME = 'leave-game',
}

export class SocketClient {
  private baseUrl = 'http://localhost:5000'
  socket: Socket

  game: GameSocketResponse
  currentUser: UserResponse

  constructor(user: UserResponse) {
    this.currentUser = user
  }

  public connect = async (rerenderCb: CallableFunction): Promise<void> => {
    this.socket = io(this.baseUrl, {
      withCredentials: true,
      transports: ['websocket'],
      timeout: 500,
      reconnection: false,
      upgrade: true,
    })
    // socket event listeners
    this.socket.on('update', (game: GameSocketResponse) => {
      if(this.updateGameState(game)) {
        rerenderCb()
      }
    })
    this.socket.on('disconnect', () => {
      rerenderCb('disconnect')
    })
    this.socket.on('connection_error', (err: string) => {
      console.error(err)
    })
    return new Promise(resolve => {
      this.socket.on('connected', () => {
        resolve()
      })
    })
  }

  private get allUsersPlayed() {
    return this.game.users.every(user => user.hasPlayed)
  }

  public getGame = () => {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    this.socket.emit(Events.GET_GAME)
  }

  public joinGame = (key: string = this.game.key) => {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    if(!key && !this.game.key) throw new Error('No gameKey specified.')
    this.socket.emit(Events.JOIN, key)
  }

  public startGame = () => {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    this.socket.emit(Events.START)
  }

  public playCard = (card: CardResponse) => {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    if(!this.currentUser.hasPlayed) {
      this.socket.emit(Events.PLAY_CARD, card.id)
    }
  }

  public flipCard = (card: CardResponse) => {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    if(card.state === CardState.PLAYED_SHOW) throw new Error('Card is already flipped')
    this.socket.emit(Events.FLIP_CARD, card.id)
  }

  public voteCard = (card: CardResponse) => {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    if(!this.allUsersPlayed) {
      throw new Error('All user must play before voting')
    }
    if(this.game.users
      .flatMap(user => user.cards)
      .some(card => card.state === CardState.PLAYED_SHOW)
    ) {
      throw new Error('All cards must be flipped before vote')
    }
    this.socket.emit(Events.VOTE_CARD, card.id)
  }

  public leaveGame = () => {
    if(!this.socket) throw new Error('InGameClient not connected to socket.')
    this.socket.emit(Events.LEAVE_GAME)
  }

  private updateGameState = (game: GameSocketResponse) => {
    // a type of cache to not re-update the state if the new state is the same as current
    // todo: This might not be needed anymore since we've fixed the issues with the socket
    if(JSON.stringify(this.game) === JSON.stringify(game)) return false
    console.log('game: ', game)
    this.currentUser = game.users.find(user => user.id === this.currentUser.id)
    this.game = game
    return true
  }
}