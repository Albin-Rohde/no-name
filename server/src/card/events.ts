import {GameStateError, NotAllowedError} from "../error";
import {CardState} from "./models/WhiteCardRef";
import {Server, Socket} from "socket.io";
import {emitUpdateEvent} from "../socketEmitters";
import {getGameFromUser} from "../game/services";

/**
 * Play card event
 * Will play the card on the game that the user
 * is attached to. If allowed by game rules.
 */
export async function playCardEvent(io: Server, socket: Socket, cardIds: [number]) {
  const game = await getGameFromUser(socket.request.session.user.id);
  if (cardIds.length < 1) {
    throw new Error('Received empty list of cardIds');
  }
  if (!game.active) {
    throw new GameStateError('Can not play card in inactive game')
  }
  if (game.currentUser.isCardWizz) {
    throw new NotAllowedError('You can not play a card as card  wizz')
  }
  if (game.isFinished) {
    throw new GameStateError('Can not play card in finished game')
  }
  if (cardIds.length !== game.blackCard.blackCard.blanks) {
    throw new NotAllowedError('Invalid number of white cards played.');
  }
  const cards = cardIds.map((cardId) => game.currentUser.findCard(cardId));
  await Promise.all(cards.map((wcr, order) => wcr.play(order)));
  game.currentUser.hasPlayed = true;
  await emitUpdateEvent(io, socket, game);
}

/**
 * Flip card event
 * Will flip the card on the game that the user
 * is attached to. If allowed by game rules.
 */
export async function flipCardEvent(io: Server, socket: Socket, cardId: number) {
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
  await emitUpdateEvent(io, socket, game)
}

/**
 * Vote card event
 * Will vote for a card in the game that the user it attached to
 * if allowed by game rules.
 */
export async function voteCardEvent(io: Server, socket: Socket, cardId: number) {
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
  if (game.allPlayerCards.some(card => card.state === CardState.PLAYED_HIDDEN && card.order === 0)) {
    throw new NotAllowedError('All cards must be flipped before voting')
  }
  const card = game.findCard(cardId)
  if(card.state !== CardState.PLAYED_SHOW) {
    throw new NotAllowedError('Can only vote for a shown played card')
  }
  const winningUser = game.findUser(card.user_id_fk)
  winningUser.score += 1
  await card.winner()
  await emitUpdateEvent(io, socket, game)
}
