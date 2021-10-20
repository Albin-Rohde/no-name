import React, {useEffect, useState} from 'react';

import Home from "./screens/Home";
import './App.css';
import User from "./clients/User";
import {Route, Switch, useHistory} from 'react-router-dom'
import Register from "./screens/Register";
import ErrorSnack from "./components/ErrorSnack";
import Login from "./screens/Login";
import MenuAppBar from "./components/MenuAppBar";
import SetupGame from "./screens/SetupGame";
import Lobby from "./screens/inGame/Lobby";
import {SocketClient} from "./clients/SocketClient";
import {GameResponse, UserData, UserResponse} from "./clients/ResponseTypes";
import RestClient from "./clients/RestClient";
import {AuthenticationError} from "./clients/error";
import Game from "./clients/Game";
import GameScreen from "./screens/inGame/Game"


interface GameHandlerContextType {
  getUser: () => Promise<User>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  createConnectedSocket: () => Promise<void>;
  userRequired: () => Promise<boolean>;
  gameRequired: () => Promise<boolean>;
  socket: SocketClient;
  user: User;
  game: Game;
}
export const GameHandlerContext = React.createContext<GameHandlerContextType>(undefined)
export const SetErrorContext = React.createContext(null);

function App() {
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState<SocketClient>(undefined);
  const [game, setGame] = useState<Game>();
  const [user, setUser] = useState<User>(undefined);
  const rest = new RestClient();
  const history = useHistory();

  const getUser = async (): Promise<User> => {
    try {
      const user = await rest.makeRequest<UserResponse>({method: 'get', route: 'user', action: 'get'});
      return new User(user);
    } catch (err) {
      if (!(err instanceof AuthenticationError)) {
        setError(err.message);
      }
      throw err;
    }
  }

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userData = await rest.makeRequest<UserData>({
        method: 'post',
        route: 'user',
        action: 'login',
        data: {
          email,
          password,
        }
      })
      const user = new User(userData);
      setUser(user);
      history.push('/')
    } catch (err) {
      setError(err.message);
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await rest.makeRequest<null>({ method: 'post', route: 'user', action: 'logout' });
      history.push('/register');
      setUser(null);
      setSocket(null);
      setGame(null);
    } catch (err) {
      if (!(err instanceof AuthenticationError)) {
        setError(err.message);
      }
    }
  }

  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      const userData = await rest.makeRequest<UserData>({
        method: 'post',
        route: 'user',
        action: 'register',
        data: {
          email,
          password,
          username: name,
        }
      })
      setUser(new User(userData));
    } catch (err) {
      setError(err.message);
    }
  }

  const createConnectedSocket = async (): Promise<void> => {
    if (user) {
      const s = new SocketClient(user.getData());
      await s.connect((disconnect) => {
        if (!disconnect) {
          setGame(s.gameData);
        }
      }, setError)
      setSocket(s);
      console.log('socket created')
      console.log('socket: ', s);
    } else {
      setError('You are not connected to game');
      history.push('/register');
    }
  }

  const userRequired = async (): Promise<boolean> => {
    try {
      if (!user) {
        const user = await getUser();
        setUser(user);
        return false;
      }
      return true
    } catch (err) {
      console.log('user req error')
      console.log(history.location)
      setError(err.message);
      history.push('/register')
    }
  }

  const gameRequired = async (): Promise<boolean> => {
    try {
      if (!game) {
        await rest.makeRequest<GameResponse>({method: 'get', route: 'game'});
      }
    } catch (err) {
      setError(err.message);
      history.push('/');
    }
    return true;
  }

  const gameHandlers: GameHandlerContextType = {
    getUser,
    gameRequired,
    createConnectedSocket,
    login,
    logout,
    register,
    user,
    userRequired,
    socket,
    game,
  }

  useEffect(() => {
    (async () => {
      try {
        if (user && socket) {
          return
        }
        if (!user) {
          const u = await getUser();
          if (u) {
            setUser(u);
          }
          return
        }
        if (!socket) {
          const s = new SocketClient(user);
          await s.connect((disconnect) => {
            if (!disconnect) {
              setGame(s.gameData);
            }
          }, setError)
          setSocket(s);
          s.getGame();
        }
      } catch (err) {
        if (!(err instanceof AuthenticationError)) {
          setError(err.message);
        }
      }
    })()
  }, [socket, user])
  console.log('state: ', gameHandlers);
  return (
    <React.Fragment>
      <SetErrorContext.Provider value={setError}>
        <GameHandlerContext.Provider value={gameHandlers}>
          <ErrorSnack open={!!error} message={error}/>
          <MenuAppBar/>
          <Switch>
            <Route
              exact={true}
              path={"/register"}
              component={Register}
            />
            <Route
            exact={true}
            path={"/login"}
            component={Login}
            />
            <Route
              exact={true}
              path={"/create-game"}
              component={SetupGame}
            />
            <Route
              exact={false}
              path={"/lobby"}
              component={Lobby}
            />
            <Route
              exact={false}
              path={"/game"}
              component={GameScreen}
            />
            <Route path="/" component={Home} />
          </Switch>
        </GameHandlerContext.Provider>
      </SetErrorContext.Provider>
    </React.Fragment>
  );
}

export default App;
