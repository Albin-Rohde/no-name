import {User} from "../../db/user/models/User";
import {Game} from "../../db/game/models/Game";
import {v4 as uuidv4} from "uuid";
import {GameRound} from "../../db/game/models/GameRound";
import {getManager} from "typeorm";

interface gameSettings {
  playCards: number
  rounds: number
  playerLimit: number
  private: boolean
}

export async function createNewGame (user: User, options: gameSettings): Promise<Game> {
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

export async function deleteGame (user: User): Promise<void> {
  if(!user.isHost) {
    throw new Error('User is not host, Only host can delete game')
  }
  // TODO: use querybuilder for this instead
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