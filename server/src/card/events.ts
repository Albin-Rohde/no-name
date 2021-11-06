import {GameStateError, NotAllowedError} from "../error";
import {CardState} from "./models/WhiteCardRef";
import {SocketWithSession} from "../globalTypes";
import {Server} from "socket.io";
import {emitUpdateEvent} from "../socketEmitters";
import {getGameFromUser} from "../game/services";

/**
 * Play card event
 * Will play the card on the game that the user
 * is attached to. If allowed by game rules.
 */
export async function playCardEvent(io: Server, socket: SocketWithSession, cardId: number) {
  const game = await getGameFromUser(socket.request.session.user.id);
  if (!game.active) {
    throw new GameStateError('Can not play card in inactive game')
  }
  if (game.isFinished) {
    throw new GameStateError('Can not play card in finished game')
  }
  const card = game.currentUser.findCard(cardId)
  await card.play()
  game.currentUser.hasPlayed = true
  await emitUpdateEvent(io, game)
}

/**
 * Flip card event
 * Will flip the card on the game that the user
 * is attached to. If allowed by game rules.
 */
export async function flipCardEvent(io: Server, socket: SocketWithSession, cardId: number) {
  const game = await getGameFromUser(socket.request.session.user.id);
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
  await emitUpdateEvent(io, game)
}

/**
 * Vote card event
 * Will vote for a card in the game that the user it attached to
 * if allowed by game rules.
 */
export async function voteCardEvent(io: Server, socket: SocketWithSession, cardId: number) {
  const game = await getGameFromUser(socket.request.session.user.id);
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
  await emitUpdateEvent(io, game)
}
