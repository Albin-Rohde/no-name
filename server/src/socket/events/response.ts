import { CardState, WhiteCardRef } from '../../db/card/models/WhiteCardRef'
import { User } from '../../db/user/models/User'
import { Game } from '../../db/game/models/Game'
import { GameRound } from '../../db/game/models/GameRound'
import { BlackCard } from '../../db/card/models/BlackCard'

interface GameResponse {
  key: string
  gameOptions: GameOptionsResponse
  started: boolean
  blackCard?: BlackCardResponse | undefined
  users: UserResponse[]
}

interface GameOptionsResponse {
  deck: string
  cardLimit: number
  playerLimit: number
  privateLobby: boolean
  rounds: number
}

interface UserResponse {
  id: number
  username: string
  cards: CardResponse[]
  cardWizz: boolean
  hasPlayed: boolean
  isHost: boolean
  score: number
}

interface CardResponse {
  id: number
  text: string
  state: CardState
}

interface BlackCardResponse {
  id: number,
  text: string,
}

const normalizeUserResponse = (user: User, currentRound: GameRound | undefined): UserResponse => ({
  id: user.id,
  username: user.username,
  cards: user.cards ? [...user.cards.map(normalizeCardResponse)] : [],
  cardWizz: currentRound?.card_wizz_user_id_fk === user.id,
  hasPlayed: user.hasPlayed,
  isHost: user.isHost,
  score: user.score,
})

const normalizeCardResponse = (card: WhiteCardRef): CardResponse => ({
  id: card.id,
  text: card.white_card.text,
  state: card.state,
})

const normalizeBlackCardResponse = (card: BlackCard): BlackCardResponse | undefined => {
  if (card) {
    return {
      id: card.id,
      text: card.text
    }
  }
  return undefined
}

/**
 * Takes a game and a currentRound and
 * normalize the data into a format that
 * the client will understand. <GameResponse>
 * @param game
 * @param currentRound
 */
export const normalizeGameResponse = (game: Game, currentRound: GameRound | undefined): GameResponse => ({
  key: game.key,
  gameOptions: {
    deck: game.cardDeck,
    cardLimit: game.playCards,
    playerLimit: game.playerLimit,
    privateLobby: game.privateLobby,
    rounds: game.rounds
  },
  started: game.started,
  blackCard: normalizeBlackCardResponse(game.blackCard),
  users: game.users ? [...game.users.map(user => normalizeUserResponse(user, currentRound))] : []
})