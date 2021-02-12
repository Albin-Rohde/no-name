import type { Server } from 'socket.io'
import { getUniqueCards } from '../card/services';

import { User } from "../user/models/User";
import { Game } from "./models/Game";

interface optionsShape {
  playCards: number
  rounds: number
  playerLimit: number
  private: boolean
}

const getGameByKey = async (key: string) => {
  try {
    const game = await Game.findOneOrFail(key)
    return game
  } catch {
    throw new Error('GAME_NOT_FOUND')
  }
}

const createNewGame = async (user: User, options: optionsShape) => {
  try {
    const game = new Game()
    game.play_cards = options.playCards
    game.player_limit = options.playerLimit
    game.private_lobby = options.private
    game.rounds = options.rounds
    game.card_deck = 'default'
    user.game = game
    await user.save()
    return game
  } catch(err) {
    console.log(err)
    throw new Error(err)
  }
}

const deleteGame = async (user: User) => {
  const {game} = await User.findOneOrFail(user.id, {relations: ['game']})
  game.users = []
  game.save()
  game.remove()
}

const joinGame = async (io: Server, socket: any, key: string) => {
	const userId = socket.handshake.session?.user?.id
	if(!userId) {
		socket.disconnect()
	}
	try {
		const user = await User.findOneOrFail(userId)
		const game = await Game.findOneOrFail(key, {relations: ['users']})
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
		io.in(game.key).emit('update', {game, user})
	} catch(e) {
		socket.disconnect()
	}
}

const startGame = async (io: Server, socket: any) => {
	const user: User = socket.handshake.session?.user
	if(!user) {
		socket.disconnect()
	}
	const game = await Game.findOneOrFail(user.game.key, {relations: ['users', 'users.cards']})
	game.users.forEach(async (user) => {
		user.cards = await getUniqueCards(game.play_cards)
		await user.save()
	})
	const currentUser = game.users.filter(u => u.id === user.id)[0]
	await game.save()
	io.in(game.key).emit('update', {game, user: currentUser})
}

export {createNewGame, deleteGame, getGameByKey, joinGame, startGame}
