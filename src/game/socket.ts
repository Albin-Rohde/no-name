import type { Server, Socket } from 'socket.io'
import { normalizeGameResponse } from './normalizeRespose'
import { Game } from "./models/Game"
import { CardState, PlayerCard } from '../card/models/PlayerCard'
import { givePlayersCards } from './services'

const joinGame = async (io: Server, socket: Socket, key: string) => {
	const user = socket.request.session.user
	try {
		const game = await Game.findOneOrFail(key, {relations: ['users', 'users.cards', 'users.cards.white_card']})
		if(game.users.length === game.player_limit) {
			if(!game.users.some(u => u.id === user.id)) {
				return socket.disconnect()
			}
		}
		if(!game.users.some(u => u.id == user.id)) {
			game.users.push(user)
		}
		game.save()
		socket.join(key)
		io.in(game.key).emit('update', normalizeGameResponse(game))
	} catch(e) {
		socket.disconnect()
	}
}

const startGame = async (io: Server, socket: any) => {
	const user = socket.request.session.user
	try {
		const game = await Game.findOneOrFail(user.game.key, {relations: ['users', 'users.cards', 'users.cards.white_card']})
		if(game.started) {
			return
		}
		await givePlayersCards(game)
		game.started = true
		await game.save()
		io.in(game.key).emit('update', normalizeGameResponse(game))
	} catch(err) {
		console.log(err)
	}
}

const playCard = async(io: Server, socket: any, cardId: number) => {
	const user = socket.request.session.user
	const card = await PlayerCard.findOne({id: cardId, game_key: user.game.key, user_id_fk: user.id})
	if(card) {
		card.state = CardState.PLAYED_HIDDEN
		await card.save()
	}
	const game = await Game.findOneOrFail(user.game.key, {relations: ['users', 'users.cards', 'users.cards.white_card']})
	io.in(game.key).emit('update', normalizeGameResponse(game))
}

export {joinGame, startGame, playCard}