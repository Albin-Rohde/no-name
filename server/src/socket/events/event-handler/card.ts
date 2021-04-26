import {Game} from "../../../db/game/models/Game";
import {EventFunctionWithGame} from "./index";

/**
 * Play card event
 * Will play the card on the game that the user
 * is attached to. If allowed by game rules.
 * @param game
 * @param cardId - Card to play
 */
export const playCardEvent: EventFunctionWithGame<number> = async(game, cardId: number): Promise<Game> => {
  await game.currentUser.playCard(cardId)
  return game
}

/**
 * Flip card event
 * Will flip the card on the game that the user
 * is attached to. If allowed by game rules.
 * @param game
 * @param cardId
 */
export const flipCardEvent: EventFunctionWithGame<number> = async(game, cardId: number): Promise<Game> => {
  if(!game.currentUser.isCardWizz) {
    throw new Error('Only card wizz can flip card')
  }
  await game.flipCard(cardId)
  return game
}

/**
 * Vote card event
 * Will vote for thr card on the game
 * that the user it attached to if allowed by game
 * rules.
 * @param game
 * @param cardId
 */
export const voteCardEvent: EventFunctionWithGame<number> = async(game, cardId: number): Promise<Game> => {
  if(!game.currentUser.isCardWizz) {
    throw new Error('Only card wizz can vote card')
  }
  await game.voteCard(cardId)
  return game
}
