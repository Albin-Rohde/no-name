import axios from 'axios'
import type userClientType from './UserClient'
import type { UserData} from './UserClient'
import { io, Socket } from 'socket.io-client'

interface GameResponse {
  play_cards: number
  rounds: number
  player_limit: number
  private_lobby: boolean
  card_deck: string
	started: boolean
  key?: string
  users?: [UserData]
}

export default class GameClient {
  private baseUrl = 'http://localhost:5000'
  private route = '/game'
  currentUser: UserData
  socket: Socket
  
  playCards: number = 5
  rounds: number = 3
  playerLimit: number = 2
  private: boolean = true
  cardDeck: string = 'default'
  users: [UserData?] = []
  key: string = ''
  socketConnected: boolean = false
	gameStarted: boolean = false

  constructor(userData: UserData) {
    this.currentUser = userData
  }

  getSessionGame = async () => {
    try {
      const data: GameResponse = await this.makeRequest('', 'get')
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
      const data: GameResponse = await this.makeRequest('', 'post', {
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
			this.currentUser.cards = []
			this.users = [this.currentUser]
			this.gameStarted = false
			this.socketConnected = false
    } catch(err) {}
  }

  connectToGameSession = (rerenderCb) => {
    this.socket = io(this.baseUrl, {
      withCredentials: true,
    })
    this.socket.emit('join', this.key)

    this.socket.on('update', (game: GameResponse) => {
			if(game) {
				this.users = game.users
				this.playerLimit = game.player_limit
				this.gameStarted = game.started
				this.socketConnected = true
				this.currentUser = game.users.filter(u => u.id === this.currentUser.id)[0]
			}
			console.log('got update')
			console.log(this.currentUser)
      rerenderCb()
    })
    this.socket.on('disconnect', () => {
      rerenderCb('disconnect')
    })
  }

	startGame = () => {
		this.socket.emit('start')
		this.gameStarted = true
	}

  private makeRequest = async (url: string, method: 'put' | 'get' | 'post' | 'delete', data: object = {}) => {
    try {
      const res: GameResponse = await axios({
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