import type { Server, Socket } from 'socket.io'
import { normalizeGameResponse } from './normalizeRespose'
import { Game } from "./models/Game"
import { addPlayerToGame, handlePlayCard, startGame } from './services'

const joinGameEvent = async (io: Server, socket: Socket, key: string) => {
	const user = socket.request.session.user
	const game = await Game.findOneOrFail(user.game.key, {relations: ['users', 'users.cards', 'users.cards.white_card']})
	try {
		await addPlayerToGame(game, user)
		socket.join(key)
		io.in(game.key).emit('update', normalizeGameResponse(game))
	} catch(err) {
		socket.emit('connection_error', err.message)
	}
}

const startGameEvent = async (io: Server, socket: any) => {
	const user = socket.request.session.user
	const game = await Game.findOneOrFail(user.game.key, {relations: ['users', 'users.cards', 'users.cards.white_card']})
	try {
		await startGame(game)
		io.in(game.key).emit('update', normalizeGameResponse(game))
	} catch(err) {
		socket.emit('connection_error', err.message)
	}
}

const playCardEvent = async(io: Server, socket: any, cardId: number) => {
	const user = socket.request.session.user
	const game = await Game.findOneOrFail(user.game.key, {relations: ['users', 'users.cards', 'users.cards.white_card']})
	try {
		handlePlayCard(game, user, cardId)
		io.in(game.key).emit('update', normalizeGameResponse(game))
	} catch(err) {
		socket.emit('connection_error', err.message)
	}
}

export {joinGameEvent, startGameEvent, playCardEvent}