import {Server, Socket} from "socket.io";
import { setTimeoutAsync } from "../util";
import {
  createNewGame,
  deleteGameFromUser,
  endGame,
  getGameFromUser,
  getGameRound,
  getGameWithRelations
} from "./services";
import { GameRuleError, GameStateError, NotFoundError } from "../error";
import {getUserUserWithWinningCard, getUserWithRelation} from "../user/services";
import { normalizeGameResponse } from "../socketResponse";
import {CardState} from "../card/models/WhiteCardRef";
import {emitNotificationsEvent, emitRemovedEvent, emitUpdateEvent} from "../socketEmitters";

/**
 * Gets a game if any is attached to the
 * user making the request.
 */
export async function getGameEvent(io: Server, socket: Socket): Promise<void> {
  try {
    const game = await getGameFromUser(socket.request.session.user.id)
    if(!socket.rooms.has(game.key)) {
      socket.join(game.key)
    }
    await emitUpdateEvent(io, game);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return;
    }
    throw err
  }
}

/**
 * Joins a game by gameKey
 */
export async function joinGameEvent(io: Server, socket: Socket, key: string): Promise<void> {
  const game = await getGameWithRelations(key)
  const user = await getUserWithRelation(socket.request.session.user.id)
  if (game.active) {
    throw new GameStateError('Can not join active game')
  }
  if (game.isFinished) {
    throw new GameStateError('Can not join finished game')
  }
  user.score = 0
  user.hasPlayed = false
  game.addPlayer(user)
  socket.join(game.key)
  await emitUpdateEvent(io, game)
}

/**
 * Start game
 * Only the gameHost can do this action.
 */
export async function startGameEvent(io: Server, socket: Socket): Promise<void> {
  const game = await getGameFromUser(socket.request.session.user.id);
  if (game.active) {
    throw new GameStateError('Game already active')
  }
  if (game.isFinished) {
    throw new GameStateError('Can not start finished game')
  }
  if (!game.currentUser.isHost) {
    throw new GameRuleError('User is not host, only host can start game')
  }
  game.active = true
  await Promise.all([
    game.handOutCards(),
    game.assingCardWizz(),
    game.newBlackCard(),
  ])
  await emitUpdateEvent(io, game)
}

/**
 * Creates a new game, sending the key for the new game to all
 * players in the current game. This make it possible for them to use
 * that key to join the new game.
 */
export async function playAgainEvent(io: Server, socket: Socket): Promise<void> {
  const game = await getGameFromUser(socket.request.session.user.id);
  if (game.active) {
    throw new GameStateError('Can not restart ongoing game')
  }
  if (!game.currentUser.isHost) {
    throw new GameRuleError('Only host can restart game')
  }
  const newGame = await createNewGame(game.currentUser, {
    playCards: game.playCards,
    playerLimit: game.playerLimit,
    cardDeck: game.card_deck_fk,
    private: game.privateLobby,
    rounds: game.rounds,
  })
  newGame.users = [game.currentUser]
  socket.leave(game.key)
  socket.join(newGame.key)
  socket.emit('update', normalizeGameResponse(newGame))
  io.in(game.key).emit('next-game', newGame.key)
  // TODO: should this emit anything else?
}

/**
 * Leaves the game that the requesting user
 * is attached to.
 */
export async function leaveGameEvent(io: Server, socket: Socket) {
  const game = await getGameFromUser(socket.request.session.user.id);
  await game.removePlayer(game.currentUser)
  await emitUpdateEvent(io, game)
}

/**
 * Deletes the game that the requesting user
 * is attached to.
 *
 * Additionally sends a removed event to remaining
 * players. Disconnecting them from the game.
 */
export async function deleteGameEvent(io: Server, socket: Socket) {
  const game = await getGameFromUser(socket.request.session.user.id);
  await deleteGameFromUser(game.currentUser)
  await emitRemovedEvent(io, socket, game);
}

/**
 * Goes to next round of the game
 *
 * - Create a new black card
 * - Hand out new white cards
 * - Next round with new card wizz
 * - Discards played cards as used
 */
export async function nextRoundEvent(io: Server, socket: Socket) {
  await setTimeoutAsync(6000)
  const game = await getGameFromUser(socket.request.session.user.id);
  if (game.turn_number === game.rounds * game.users.length) {
    const finishedGame = await endGame(game);
    await emitUpdateEvent(io, finishedGame)
    return;
  }
  const updateCards = game.allPlayerCards
    .filter((card) => {
      return (
        card.state === CardState.PLAYED_SHOW ||
        card.state === CardState.WINNER
      )
    })
    .map(async (card) => {
      card.state = CardState.USED
      await card.save()
    })
  const updateUsers = game.users.map(async (user) => {
    user.hasPlayed = false
    await user.save()
  })
  const newBlackCard = game.newBlackCard()
  const newPlayerCards = game.handOutCards()
  const nextTurn = async () => {
    game.turn_number++
    game.currentTurn = await getGameRound(game.key, game.turn_number)
  }
  await Promise.all(updateCards);
  await Promise.all([
    ...updateUsers,
    newBlackCard,
    newPlayerCards,
  ])
  await nextTurn()
  await emitUpdateEvent(io, game);
}

export async function notifyCardWizzEvent(io: Server, socket: Socket) {
  const game = await getGameFromUser(socket.request.session.user.id);
  if (game.active) {
    const cardWizz = game.currentTurn.cardWizz;
    const message = `${cardWizz.username} is card wizz this turn`
    await emitNotificationsEvent(io, socket, message)
  }
}

export async function notifyWinnerEvent(io: Server, socket: Socket) {
  const gameKey = socket.request.session.user.game_fk
  const user = await getUserUserWithWinningCard(gameKey)
  const message = `${user.username} won this round`;
  await emitNotificationsEvent(io, socket, message)
}
