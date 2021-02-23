import type { Server } from 'socket.io'
import { getUniqueCards } from '../card/services'
import { normalizeGameResponse } from './normalizeRespose'
import { User } from "../user/models/User"
import { Game } from "./models/Game"
import { CardState, PlayerCard } from '../card/models/PlayerCard'

const joinGame = async (io: Server, socket: any, key: string) => {
	const user = socket.handshake.session?.user
	if(!user) {
		socket.disconnect()
	}
	try {
		console.log('join event')
		const game = await Game.findOneOrFail(key, {relations: ['users', 'users.cards', 'users.cards.white_card']})
		console.log('game: ', game)
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
	const user: User = socket.handshake.session?.user
	if(!user) {
		socket.disconnect()
	}
	const game = await Game.findOneOrFail(user.game.key, {relations: ['users', 'users.cards', 'users.cards.white_card']})

	await Promise.all(game.users.map(async (user) => {
		user.cards = await getUniqueCards(game.play_cards, game.key)
		return user.save()
	}))

	game.started = true
	await game.save()
	io.in(game.key).emit('update', normalizeGameResponse(game))
}

const playCard = async(io: Server, socket: any, cardId: number) => {
	const user: User = socket.handshake.session?.user
	if(!user) {
		socket.disconnect()
	}
	const card = await PlayerCard.findOne({id: cardId, game_key: user.game.key, user_id_fk: user.id})
	if(card) {
		card.state = CardState.PLAYED_HIDDEN
		await card.save()
	}
	const game = await Game.findOneOrFail(user.game.key, {relations: ['users', 'users.cards', 'users.cards.white_card']})
	io.in(game.key).emit('update', normalizeGameResponse(game))
}

export {joinGame, startGame, playCard}