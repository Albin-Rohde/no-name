import type { Server, Socket } from 'socket.io'
import { makeGameResponse } from './normalizeRespose'
import { addPlayerToGame, handlePlayCard, startGame } from './services'

const joinGameEvent = async (io: Server, socket: Socket, key: string) => {
	const {user} = socket.request.session
	await addPlayerToGame(user, key)
	socket.join(key)
	io.in(user.game.key).emit('update', await makeGameResponse(user))
}

const startGameEvent = async (io: Server, socket: any) => {
	const {user} = socket.request.session
	await startGame(user.game)
	io.in(user.game.key).emit('update', await makeGameResponse(user))
}

const playCardEvent = async(io: Server, socket: any, cardId: number) => {
	const {user} = socket.request.session
	await handlePlayCard(user, cardId)
	io.in(user.game.key).emit('update', await makeGameResponse(user))
}

export {joinGameEvent, startGameEvent, playCardEvent}