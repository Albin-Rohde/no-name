import { Game } from "../../../db/game/models/Game";
import { EventFunctionWithGame } from "./index";
import {GameStateError, NotAllowedError} from "../..";
import { CardState } from "../../../db/card/models/WhiteCardRef";

/**
 * Play card event
 * Will play the card on the game that the user
 * is attached to. If allowed by game rules.
 * @param game
 * @param cardId - Card to play
 */
export const playCardEvent: EventFunctionWithGame<number> = async(
  game,
  cardId: number
): Promise<Game> => {
  if (!game.active) {
    throw new GameStateError('Can not play card in inactive game')
  }
  if (game.isFinished) {
    throw new GameStateError('Can not play card in finished game')
  }
  const card = game.currentUser.findCard(cardId)
  await card.play()
  game.currentUser.hasPlayed = true
  return game
}

/**
 * Flip card event
 * Will flip the card on the game that the user
 * is attached to. If allowed by game rules.
 * @param game
 * @param cardId
 */
export const flipCardEvent: EventFunctionWithGame<number> = async(
  game,
  cardId: number
): Promise<Game> => {
  if (!game.active) {
    throw new GameStateError('Can not flip card in inactive game')
  }
  if (game.isFinished) {
    throw new GameStateError('Can not flip card in finished game')
  }
  if(!game.currentUser.isCardWizz) {
    throw new NotAllowedError('Only card wizz can flip card')
  }
  if (!game.allPlayers.every(user => user.hasPlayed)) {
    throw new NotAllowedError('ALl user must play before any cards can be flipped')
  }
  const card = game.findCard(cardId)
  await card.flip()
  return game
}

/**
 * Vote card event
 * Will vote for a card in the game that the user it attached to
 * if allowed by game rules.
 * @param game
 * @param cardId
 */
export const voteCardEvent: EventFunctionWithGame<number> = async(game,cardId: number): Promise<Game> => {
  if (!game.active) {
    throw new GameStateError('Game is not active')
  }
  if (game.isFinished) {
    throw new GameStateError('Can not vote card in finished game')
  }
  if(!game.currentUser.isCardWizz) {
    throw new NotAllowedError('Only card wizz can vote card')
  }
  if (!game.allPlayers.every(user => user.hasPlayed)) {
    throw new NotAllowedError('ALl user must play before voting')
  }
  if(game.allPlayerCards.some(card => card.state === CardState.PLAYED_HIDDEN)) {
    throw new NotAllowedError('All cards must be flipped before voting')
  }
  const card = game.findCard(cardId)
  if(card.state !== CardState.PLAYED_SHOW) {
    throw new NotAllowedError('Can only vote for a shown played card')
  }
  const winningUser = game.findUser(card.user_id_fk)
  winningUser.score += 1
  await card.winner()
  return game
}
