import type { Server, Socket } from 'socket.io'
import { makeGameResponse } from '../game/normalizeRespose'
import { addPlayerToGame, handlePlayCard, startGame } from './services'
import { getUserWithRelation } from '../user/services'

const socketEventHandler = async (socket: Socket, io: Server, next: any) => {
	socket.on('join', (key: string) => joinGameEvent(io, socket, key))
	socket.on('start', () => startGameEvent(io, socket))
	socket.on('play-card', (cardId: number) => playCardEvent(io, socket, cardId))
	socket.on('get-game', () => getGameEvent(io, socket))
	next()
}

const joinGameEvent = async (io: Server, socket: Socket, key: string) => {
	try {
		const user = await getUserWithRelation(socket.request.session.user.id)
		const game = await addPlayerToGame(user, key)
		socket.join(key)
		io.in(key).emit('update', await makeGameResponse(game))
	} catch(err) {
		console.error(err)
		socket.emit('connection_error', err.message)
	}
}

const startGameEvent = async (io: Server, socket: Socket) => {
	try {
		const user = await getUserWithRelation(socket.request.session.user.id)
		await startGame(user)
		io.in(user.game.key).emit('update', await makeGameResponse(user.game))
	} catch(err) {
		console.error(err)
		socket.emit('connection_error', err.message)
	}
}

const playCardEvent = async(io: Server, socket: Socket, cardId: number) => {
	try {
		const user = await getUserWithRelation(socket.request.session.user.id)
		await handlePlayCard(user, cardId)
		io.in(user.game.key).emit('update', await makeGameResponse(user.game))
	} catch(err) {
		console.error(err)
		socket.emit('connection_error', err.message)
	}
}

const getGameEvent = async(io: Server, socket: Socket) => {
	try {
		const user = await getUserWithRelation(socket.request.session.user.id)
		if (user.game) {
			socket.emit('update', await makeGameResponse(user.game))
		}
	} catch(err) {
		console.error(err)
		socket.emit('connection_error', err.message)
	}
}

export {socketEventHandler}
