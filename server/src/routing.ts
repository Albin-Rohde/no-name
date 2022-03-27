import {Application} from "express";
import userRoute from "./user/controller";
import gameRouter from "./game/controller";
import deckRouter from "./deck/controller";
import {SocketServer} from "./lib/socket/Socket";
import {
  deleteGameEvent,
  getGameEvent,
  joinGameEvent,
  leaveGameEvent, nextRoundEvent, notifyCardWizzEvent, notifyWinnerEvent,
  playAgainEvent,
  startGameEvent
} from "./game/events";
import {flipCardEvent, playCardEvent, voteCardEvent} from "./card/events";

enum Events {
  GET_GAME = 'get-game',
  JOIN_GAME = 'join-game',
  START_GAME = 'start-game',
  LEAVE_GAME = 'leave-game',
  DELETE_GAME = 'delete-game',
  PLAY_AGAIN = 'play-again',
  PLAY_CARD = 'play-card',
  FLIP_CARD = 'flip-card',
  VOTE_CARD = 'vote-card',
}
function appendListeners(io: SocketServer): void {
  io.addEventHandler(Events.JOIN_GAME, joinGameEvent)
  io.addEventHandler(Events.GET_GAME, getGameEvent)
  io.addEventHandler(Events.PLAY_AGAIN, playAgainEvent)
  io.addEventHandler(Events.START_GAME, startGameEvent)
  io.addEventHandler(Events.LEAVE_GAME, leaveGameEvent)
  io.addEventHandler(Events.DELETE_GAME, deleteGameEvent)
  io.addEventHandler(Events.PLAY_CARD, playCardEvent)
  io.addEventHandler(Events.FLIP_CARD, flipCardEvent)
  io.addEventHandler(Events.VOTE_CARD, voteCardEvent, notifyWinnerEvent, nextRoundEvent, notifyCardWizzEvent)
}

function registerRoutes(app: Application): void {
  app.get('/health', (_req, res) => {
    res.status(200).send("OK");
  })
  app.use('/user', userRoute);
  app.use('/game', gameRouter);
  app.use('/deck', deckRouter);
}

export {appendListeners, registerRoutes}