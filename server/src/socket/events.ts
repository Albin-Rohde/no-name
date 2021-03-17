import type { Server, Socket } from 'socket.io'
import { authSocketUser } from '../authenticate'
import { makeGameResponse } from '../game/normalizeRespose'
import { addPlayerToGame, handlePlayCard, startGame, leaveGame } from './services'

const socketEventHandler = async (socket: Socket, io: Server, next: any) => {
	try {
		io.use(authSocketUser)
		socket.on('get-game', () => getGameEvent(io, socket))
		socket.on('join', (key: string) => joinGameEvent(io, socket, key))
		socket.on('start', () => startGameEvent(io, socket))
		socket.on('play-card', (cardId: number) => playCardEvent(io, socket, cardId))
		socket.on('leave', () => leaveGameEvent(io, socket))
		next()
	} catch (error) {
		console.log(error)
		socket.emit('connection_error', error.message)
	}
}

const getGameEvent = async (_io: Server, socket: Socket) => {
	const {user} = socket.request.session
	if(user.game) {
		socket.emit('update', await makeGameResponse(user))
	}
}

const joinGameEvent = async (io: Server, socket: Socket, key: string) => {
	const {user} = socket.request.session
	await addPlayerToGame(user, key)
	socket.join(key)
	io.in(user.game.key).emit('update', await makeGameResponse(user))
}

const startGameEvent = async (io: Server, socket: Socket) => {
	const {user} = socket.request.session
	await startGame(user.game)
	io.in(user.game.key).emit('update', await makeGameResponse(user))
}

const playCardEvent = async(io: Server, socket: Socket, cardId: number) => {
	const {user} = socket.request.session
	await handlePlayCard(user, cardId)
	io.in(user.game.key).emit('update', await makeGameResponse(user))
}

const leaveGameEvent = async(io: Server, socket: Socket) => {
	const {user} = socket.request.session
	const gameKey = user.game.key
	leaveGame(user)
	socket.leave(gameKey)
	io.in(gameKey).emit('update', await makeGameResponse(user))
	socket.emit('update', {})
}

export {socketEventHandler}
