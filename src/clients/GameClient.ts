import axios from 'axios'
import type userClientType from './UserClient'
import type { UserData } from './UserClient'

interface gameResponse {
  play_cards: number
  rounds: number
  player_limit: number
  private_lobby: boolean
  card_deck: string
  key?: string
  users?: [UserData]
}

export default class GameClient {
  private baseUrl = 'http://localhost:5000'
  private route = '/game'
  user: userClientType
  
  playCards: number = 5
  rounds: number = 3
  playerLimit: number = 2
  private: boolean = true
  cardDeck: string = 'default'
  key: string = ''
  
  constructor(userClient: userClientType) {
    this.user = userClient
  }

  users = async () => {
    const {users} = await this.makeRequest('/users', 'get')
    return users ? users : []
  }

  getSessionGame = async () => {
    try {
      const data: gameResponse = await this.makeRequest('', 'get')
      this.playCards = data.play_cards
      this.playerLimit = data.player_limit
      this.rounds = data.rounds
      this.private = data.private_lobby
      this.cardDeck = data.card_deck
      this.key = data.key
    } catch(err) {}
  }

  createGame = async () => {
    try {
      const data: gameResponse = await this.makeRequest('', 'post', {
        playCards: this.playCards,
        rounds: this.rounds,
        playerLimit: this.playerLimit,
        private: this.private
      })
      this.playCards = data.play_cards
      this.playerLimit = data.player_limit
      this.rounds = data.rounds
      this.private = data.private_lobby
      this.cardDeck = data.card_deck
      this.key = data.key
    } catch(err) {}
  }

  deleteGame = async () => {
    try {
      await this.makeRequest('', 'delete')
      this.playCards = 5
      this.rounds = 3
      this.playerLimit = 2
      this.private = true
      this.cardDeck = 'default'
      this.key = ''
    } catch(err) {}
  }

  private makeRequest = async (url: string, method: 'put' | 'get' | 'post' | 'delete', data: object = {}) => {
    try {
      const res: gameResponse = await axios({
        withCredentials: true,
        url: `${this.baseUrl}${this.route}/${url}`,
        method,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5000",
        },
        data: data
      }).then(r => r.data)
      return res
    } catch(err) {
      throw Error(err)
    }
  }
}