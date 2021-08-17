import {CardState, WhiteCardRef} from "./card/models/WhiteCardRef";
import {User} from "./user/models/User";
import {GameTurn} from "./game/models/GameTurn";
import {BlackCardRef} from "./card/models/BlackCardRef";
import {Game} from "./game/models/Game";

interface GameResponse {
  key: string
  gameOptions: GameOptionsResponse
  active: boolean
  currentTurn: number
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

const normalizeUserResponse = (user: User, currentRound: GameTurn | undefined): UserResponse => ({
  id: user.id,
  username: user.username,
  cards: user.cards
    .filter((card) => card.state !== CardState.USED)
    .map((card) => normalizeCardResponse(card)),
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

const normalizeBlackCardResponse = (card: BlackCardRef): BlackCardResponse | undefined => {
  if (card) {
    return {
      id: card.id,
      text: card.blackCard.text
    }
  }
  return undefined
}

/**
 * Takes a game and a currentRound and
 * normalize the data into a format that
 * the client will understand. <GameResponse>
 * @param game
 */
export const normalizeGameResponse = (game: Game): GameResponse => ({
  key: game.key,
  gameOptions: {
    deck: game.cardDeck.name,
    cardLimit: game.playCards,
    playerLimit: game.playerLimit,
    privateLobby: game.privateLobby,
    rounds: game.rounds
  },
  active: game.active,
  currentTurn: game.turn_number,
  blackCard: normalizeBlackCardResponse(game.blackCard),
  users: game.users ? [...game.users.map(user => normalizeUserResponse(user, game.currentTurn))] : []
})
