import {combineReducers, createStore,} from 'redux';
import Game, {GameState} from "../clients/Game";
import {SocketClient} from "../clients/SocketClient";
import User from "../clients/User";
import {CardResponse, CardState} from "../clients/ResponseTypes";

export const updateUser = (user: User) => ({
  type: 'UPDATE_USER',
  user,
})

export const updateScreen = (screen: Screens) => ({
  type: 'NAVIGATE',
  screen,
})
export const updateGame = (game: Game) => ({
  type: 'UPDATE_GAME',
  game,
})
export const setSocket = (socket: SocketClient) => ({
  type: 'SET_SOCKET',
  socket,
})
export const setError = (error: string) => ({
  type: 'SET_ERROR',
  error,
})
export const setWarning = (warning: string) => ({
  type: 'SET_WARNING',
  warning
})
export const setNotification = (message: string) => ({
  type: 'SET_NOTIFICATION',
  message
})

// reducers.js
export const user = (state: Game, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return action.user;
    default:
      return state ?? null;
  }
};
export const screen = (state: Screens, action) => {
  switch (action.type) {
    case 'NAVIGATE':
      return action.screen;
    default:
      return state ?? null;
  }
}
export const game = (state: Game, action) => {
  switch (action.type) {
    case 'UPDATE_GAME':
      if (!state || !state.active || state.state !== GameState.FLIPPING) {
        return action.game
      }
      if (state?.currentTurn !== action.game?.currentTurn) {
        return action.game
      }
      const prevFlipped: number[] = state.playedCards.filter(c => c.state === CardState.PLAYED_SHOW).map(c => c.id)
      const currentFlipped: CardResponse[] = action.game.playedCards.filter(c => c.state === CardState.PLAYED_SHOW)
      const lastFlipped: CardResponse | undefined = currentFlipped.find((c) => !prevFlipped.includes(c.id));
      action.game.lastFlipped = lastFlipped;
      return action.game;
    default:
      return state ?? null;
  }
}
export const socket = (state: SocketClient, action) => {
  switch (action.type) {
    case 'SET_SOCKET':
      return action.socket;
    default:
      return state ?? null;
  }
}
export const error = (state: string, action) => {
  switch (action.type) {
    case 'SET_ERROR':
      return action.error;
    default:
      return state ?? null;
  }
}
export const warning = (state: string, action) => {
  switch (action.type) {
    case 'SET_WARNING':
      return action.warning;
    default:
      return state ?? null;
  }
}
export const notification = (state: string, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.message;
    default:
      return state ?? null;
  }
}

export const reducers = combineReducers({
  user,
  screen,
  game,
  socket,
  error,
  warning,
  notification
});

export type Screens = 'home' | 'lobby' | 'game' | 'create-game'

export interface ReduxState {
  user: User | null;
  game: Game | null;
  socket: SocketClient | null;
  screen: Screens;
  error: string;
  warning: string;
  notification: string;
}

const defaultState: ReduxState = {
  user: null,
  game: null,
  socket: null,
  screen: 'home',
  error: null,
  warning: null,
  notification: null,
}

export function configureStore(initialState: ReduxState) {
  // @ts-ignore
  return createStore(reducers, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}

export const store = configureStore(defaultState);
