import autoBind from "auto-bind";
import type { BlackCardResponse, CardResponse, GameOptionsResponse, GameSocketResponse, UserResponse } from './ResponseTypes';
import { CardState } from "./ResponseTypes";

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
  public active: boolean
  public currentTurn: number
  public users: UserResponse[]
  public currentUser: UserResponse
  public finished: boolean = false
  public nextGameKey: string

  constructor(currentUser: UserResponse, game?: GameSocketResponse) {
    if(game) {
      this.key = game.key
      this.gameOptions = game.gameOptions
      this.blackCard = game.blackCard
      this.active = game.active
      this.users = game.users
      this.currentTurn = game.currentTurn
    }
    this.currentUser = currentUser
    autoBind(this)
  }

  public update(data: GameSocketResponse) {
    this.key = data.key
    this.gameOptions = data.gameOptions
    this.blackCard = data.blackCard
    this.active = data.active
    this.users = data.users
    this.currentTurn = data.currentTurn
    this.currentUser = this.users.find(user => user.id === this.currentUser.id)
  }

  public get players(): UserResponse[] {
    return this.users.filter(user => !user.cardWizz)
  }

  public get isFinished(): boolean {
    return !this.active && this.currentTurn > 1
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
      allPlayedCards = [...allPlayedCards, ...player.cards.filter(card => card.state !== CardState.HAND)]
    }
    return allPlayedCards.sort((a, b) => a.id - b.id)
  }

  public get winnerCard(): CardResponse {
    return this.playedCards.find((card) => card.state === CardState.WINNER)
  }

  public get cardsOnHand(): CardResponse[] {
    return this.currentUser.cards.filter(card => card.state === CardState.HAND)
  }

  public get hiddenCards(): CardResponse[] {
    return this.playedCards.filter(card => card.state === CardState.PLAYED_HIDDEN)
  }

  public get shownCards(): CardResponse[] {
    return this.playedCards.filter(card => card.state === CardState.PLAYED_SHOW)
  }

  public get currentRound(): number {
    return Math.ceil(this.currentTurn / this.users.length)
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