import axios from 'axios'
import { io, Socket } from 'socket.io-client'
import type { UserResponse, GameResponse, GameSocketResponse, CardResponse } from './ResponseTypes'


export default class GameClient {
  private baseUrl = 'http://localhost:5000'
  private route = '/game'
  currentUser: UserResponse
  socket: Socket
  
  playCards: number = 5
  rounds: number = 3
  playerLimit: number = 2
  private: boolean = true
  cardDeck: string = 'default'
  users: UserResponse[] = []
  key: string = ''
  socketConnected: boolean = false
	gameStarted: boolean = false

  constructor(userData: UserResponse) {
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

    this.socket.on('update', (game: GameSocketResponse) => {
			if(game) {
				this.playCards = game.gameOptions.cardLimit
				this.rounds = game.gameOptions.rounds
				this.playerLimit = game.gameOptions.playerLimit
				this.private = game.gameOptions.privateLobby
				this.cardDeck = game.gameOptions.deck
				this.users = game.users
				this.gameStarted = game.started
				this.socketConnected = true
				this.currentUser = game.users.filter(u => u.id === this.currentUser.id)[0]
			}
			console.log('got update')
			console.log(game)
      rerenderCb()
    })
    this.socket.on('disconnect', () => {
      rerenderCb('disconnect')
    })

		this.socket.on('connection_error', (err: string) => {
			console.error(err)
		})
  }

	startGame = () => {
		this.socket.emit('start')
		this.gameStarted = true
	}

	playCard = (card: CardResponse) => {
		if(!this.currentUser.hasPlayed) {
			this.socket.emit('play-card', card.id)
		}
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