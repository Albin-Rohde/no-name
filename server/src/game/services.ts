import { getManager } from 'typeorm'
import { User } from "../user/models/User"
import { Game } from "./models/Game"
import {GameRound} from "./models/GameRound"
import {v4 as uuidv4} from 'uuid'

interface optionsShape {
  playCards: number
  rounds: number
  playerLimit: number
  private: boolean
}

const getGameWithRelations = async (key: string) => {
  try {
    return await Game.findOneOrFail(key, {
      relations: [
        'users',
        'users.cards',
        'users.cards.white_card',
        'users.game',
        'users.game.round',
      ]
    })
  } catch (err){
    console.error(err)
    throw new Error('GAME_NOT_FOUND')
  }
}

const getGameFromUser = async (userId: number): Promise<Game> => {
  const user = await User.findOneOrFail(userId, {relations: ['game']})
  if(!user.game) {
    throw new Error('No Game on User')
  }
  const game = await getGameWithRelations(user.game.key)
  game.currentUser = user
  return game
}

const createNewGame = async (user: User, options: optionsShape) => {
  try {
    if(user.game) {
      await deleteGame(user)
    }
    const game = new Game()
    game.key = uuidv4()
    game.play_cards = options.playCards
    game.player_limit = options.playerLimit
    game.private_lobby = options.private
    game.rounds = options.rounds
    game.card_deck = 'default'
    game.hostUserId = user.id
    user.game = game

    let gameRounds = []
    for(let i = 1; i <= game.rounds; i++) {
      const gameRound = new GameRound()
      gameRound.game_key = game.key
      gameRound.round_number = i
      gameRounds.push(gameRound.save())
    }
    await Promise.all(gameRounds)
    await user.save()
    return game
  } catch(err) {
    console.log(err)
    throw new Error(err)
  }
}

const deleteGame = async (user: User): Promise<void> => {
  if(!user.isHost) {
    throw new Error('User is not host, Only host can delete game')
  }
  const {game} = await User.findOneOrFail(user.id, {relations: ['game']})
  const gameKey = game.key
  await getManager().query(`
    UPDATE player
    SET game_fk=NULL, has_played=false, score=0
    WHERE game_fk = '${gameKey}';
  `)
  await getManager().query(`
    DELETE FROM player_card_ref
    WHERE game_key = '${gameKey}';
  `)
  await game.remove()
  await getManager().query(`
    DELETE FROM game_round
    WHERE game_key_fk = '${gameKey}';
  `)
  return
}

export {createNewGame, deleteGame, getGameWithRelations, getGameFromUser}
