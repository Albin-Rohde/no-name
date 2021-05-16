import type {CardResponse, GameSocketResponse} from './ResponseTypes'
import autoBind from "auto-bind";
import type {BlackCardResponse, GameOptionsResponse, UserResponse} from "./ResponseTypes";
import {CardState} from "./ResponseTypes";

export enum GameState {
  PLAYING = 'playing',
  FLIPPING = 'flipping',
  VOTING = 'voting',
  DISPLAY_WINNER = 'winner',
}

export default class Game {
  public key: string
  public gameOptions: GameOptionsResponse
  public blackCard?: BlackCardResponse
  public started: boolean
  public users: UserResponse[]
  public currentUser: UserResponse

  constructor(currentUser: UserResponse, game?: GameSocketResponse) {
    if(game) {
      this.key = game.key
      this.gameOptions = game.gameOptions
      this.blackCard = game.blackCard
      this.started = game.started
      this.users = game.users
    }
    this.currentUser = currentUser
    autoBind(this)
  }

  public update(data: GameSocketResponse) {
    this.key = data.key
    this.gameOptions = data.gameOptions
    this.blackCard = data.blackCard
    this.started = data.started
    this.users = data.users
    this.currentUser = this.users.find(user => user.id === this.currentUser.id)
  }

  public get players(): UserResponse[] {
    return this.users.filter(user => !user.cardWizz)
  }

  public get winningPlayer(): UserResponse {
    const winningPlayer = this.players.find(user => user.cards.some(c => c.state === CardState.WINNER))
    if(!winningPlayer) {
      throw new Error('Could not find winning player')
    }
    return winningPlayer
  }

  public get playedCards(): CardResponse[] {
    let allPlayedCards: CardResponse[] = []
    for (const player of this.players) {
      // todo: remember that !== CardState.HAND will also return card with state USED
      allPlayedCards = [...allPlayedCards, ...player.cards.filter(card => card.state !== CardState.HAND)]
    }
    return allPlayedCards
  }

  public get hiddenCards(): CardResponse[] {
    return this.playedCards.filter(card => card.state === CardState.PLAYED_HIDDEN)
  }

  public get shownCards(): CardResponse[] {
    return this.playedCards.filter(card => card.state === CardState.PLAYED_SHOW)
  }

  public get state(): GameState {
    const allHasPlayed = this.players.every(user => user.hasPlayed)
    if(!allHasPlayed) {
      return GameState.PLAYING
    }
    let playedCards = this.playedCards
    if(playedCards.some(card => card.state === CardState.PLAYED_HIDDEN)) {
      return GameState.FLIPPING
    }
    if(playedCards.every(card => card.state === CardState.PLAYED_SHOW)) {
      return GameState.VOTING
    }
    if(playedCards.some(card => card.state === CardState.WINNER)) {
      return GameState.DISPLAY_WINNER
    }
  }
}
