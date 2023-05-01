import {Application, Router, static as express_static} from "express";
import userRoute from "./user/controller";
import gameRouter from "./game/controller";
import deckRouter from "./deck/controller";
import {SocketServer} from "./lib/socket/Socket";
import {
  deleteGameEvent,
  getGameEvent,
  joinGameEvent,
  leaveGameEvent,
  nextRoundEvent,
  notifyCardWizzEvent,
  notifyWinnerEvent,
  playAgainEvent,
  startGameEvent
} from "./game/events";
import {flipCardEvent, playCardEvent, voteCardEvent} from "./card/events";
import {adminRouter} from "./admin/controller";
import cardRouter from "./card/controller";
import path from "path";

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
  // React routes
  const reactRouter = Router();
  const staticPath = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '..', '..', '..', 'frontend', 'build')
    : path.join(__dirname, '..', '..', 'frontend', 'build')
  const reactStatic = express_static(staticPath)
  const reactPaths = ['/', '/join/:key', '/reset', '/game', '/create-game', '/decks', '/deck', '/home']
  reactPaths.forEach((path) => {
    reactRouter.use(path, reactStatic)
  })
  // Serve public files
  const publicFiles = express_static(path.join(__dirname, 'public'))
  app.use('/public', publicFiles)
  // API routes
  const apiRouter = Router();
  apiRouter.use('/user', userRoute);
  apiRouter.use('/game', gameRouter);
  apiRouter.use('/deck', deckRouter);
  apiRouter.use('/card', cardRouter);
  apiRouter.get('/health', (_req, res) => {
    res.status(200).send("OK");
  })

  // register routes
  app.use('/api', apiRouter);
  app.use(reactRouter);
  app.use('/admin', adminRouter);
}

export {appendListeners, registerRoutes}