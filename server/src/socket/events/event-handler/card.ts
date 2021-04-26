import {Game} from "../../../db/game/models/Game";
import {EventFunctionWithGame} from "./index";

export const playCardEvent: EventFunctionWithGame<number> = async(game, cardId: number): Promise<Game> => {
  await game.currentUser.playCard(cardId)
  return game
}

export const flipCardEvent: EventFunctionWithGame<number> = async(game, cardId: number): Promise<Game> => {
  if(!game.currentUser.isCardWizz) {
    throw new Error('Only card wizz can flip card')
  }
  await game.flipCard(cardId)
  return game
}

export const voteCardEvent: EventFunctionWithGame<number> = async(game, cardId: number): Promise<Game> => {
  if(!game.currentUser.isCardWizz) {
    throw new Error('Only card wizz can vote card')
  }
  await game.voteCard(cardId)
  return game
}
