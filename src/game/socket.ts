import type { Server, Socket } from 'socket.io'
import { makeGameResponse } from './normalizeRespose'
import { Game } from "./models/Game"
import { addPlayerToGame, handlePlayCard, startGame } from './services'

const joinGameEvent = async (io: Server, socket: Socket, key: string) => {
	try {
		const user = socket.request.session.user
		const game = await Game.findOneOrFail(key, {relations: ['users', 'users.cards', 'users.cards.white_card']})
		await addPlayerToGame(game, user)
		socket.join(key)
		io.in(game.key).emit('update', await makeGameResponse(game))
	} catch(err) {
		socket.emit('connection_error', err.message)
	}
}

const startGameEvent = async (io: Server, socket: any) => {
	try {
		const user = socket.request.session.user
		const game = await Game.findOneOrFail(user.game.key, {relations: ['users', 'users.cards', 'users.cards.white_card']})
		await startGame(game)
		io.in(game.key).emit('update', await makeGameResponse(game))
	} catch(err) {
		console.log(err)
		socket.emit('connection_error', err.message)
	}
}

const playCardEvent = async(io: Server, socket: any, cardId: number) => {
	try {
		const user = socket.request.session.user
		await handlePlayCard(user, cardId)
		const game = await Game.findOneOrFail(user.game.key, {relations: ['users', 'users.cards', 'users.cards.white_card']})
		io.in(game.key).emit('update', await makeGameResponse(game))
	} catch(err) {
		socket.emit('connection_error', err.message)
	}
}

export {joinGameEvent, startGameEvent, playCardEvent}