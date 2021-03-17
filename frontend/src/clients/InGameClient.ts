import { io, Socket } from "socket.io-client";
import type { CardResponse, GameSocketResponse, UserResponse, GameOptionsResponse } from "./ResponseTypes";


export default class InGameClient {
	private baseUrl = 'http://localhost:5000'
	socket: Socket
	
	game: GameSocketResponse
	currentUser: UserResponse

	constructor(user: UserResponse) {
		this.currentUser = user
	}

	connect = async (rerenderCb: CallableFunction) => {
		this.socket = io(this.baseUrl, {
      withCredentials: true,
    })
		// socket event listeners
		this.socket.on('update', (game: GameSocketResponse) => {
			if(this.updateGameState(game)) {
				rerenderCb()
			}
		})
		this.socket.on('disconnect', () => {
			console.log('disconnected')
			rerenderCb('disconnect')
		})
		this.socket.on('connection_error', (err: string) => {
			console.error(err)
		})
	}

	createGame = (gameSettings: GameOptionsResponse) => {
		if(!this.socket) throw new Error('InGameClient not connected to socket.')
		this.socket.emit('create-game', gameSettings)
	}

	getGame = () => {
		if(!this.socket) throw new Error('InGameClient not connected to socket.')
		this.socket.emit('get-game')
	}

	joinGame = (key: string) => {
		if(!this.socket) throw new Error('InGameClient not connected to socket.')
		this.socket.emit('join', key)
	}

	startGame = () => {
		if(!this.socket) throw new Error('InGameClient not connected to socket.')
		console.log('starting game')
		this.socket.emit('start')
	}

	playCard = (card: CardResponse) => {
		if(!this.socket) throw new Error('InGameClient not connected to socket.')
		if(!this.currentUser.hasPlayed) {
			this.socket.emit('play-card', card.id)
		}
	}

	private updateGameState = (game: GameSocketResponse) => {
		console.log('got update')
		if(JSON.stringify(this.game) === JSON.stringify(game)) return false
		this.currentUser = game.users.find(user => user.id === this.currentUser.id)
		this.game = game
		console.log('got update and rerender')
		return true
	}
}