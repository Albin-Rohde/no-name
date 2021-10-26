import {
  combineReducers,
  createStore,
} from 'redux';
import Game from "../clients/Game";
import {UserData} from "../clients/ResponseTypes";
import RestClient from "../clients/RestClient";

export const updateGame = (game: Game) => ({
  type: 'UPDATE_GAME',
  game,
});

// reducers.js
export const game = (state = Game, action) => {
  switch (action.type) {
    case 'UPDATE_GAME':
      return action.game;
    default:
      return state;
  }
};
export const user = (state: UserData, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return action.user
  }
}

export const reducers = combineReducers({
  game,
  user,
});

interface ReduxState {
  game?: Game,
  user?: UserData,
}

export function configureStore(initialState: ReduxState = {}) {
  return createStore(reducers, initialState);
};

export const store = configureStore();
