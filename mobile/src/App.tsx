import React, {useEffect, useState} from 'react';

import Home from "./screens/Home";
import './App.css';
import User from "./clients/User";
import Register from "./screens/Register";
import ErrorSnack from "./components/ErrorSnack";
import Login from "./screens/Login";
import MenuAppBar from "./components/MenuAppBar";
import Lobby from "./screens/inGame/Lobby";
import {SocketClient} from "./clients/SocketClient";
import {GameResponse, UserResponse} from "./clients/ResponseTypes";
import RestClient from "./clients/RestClient";
import Game from "./clients/Game";
import GameScreen from "./screens/inGame/Game"
import Spinner from "./components/Spinner";

export const SetErrorContext = React.createContext(null);

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(null);
  const [socket, setSocket] = useState<SocketClient>(undefined);
  const [game, setGame] = useState<Game>();
  const [user, setUser] = useState<UserResponse>();
  const rest = new RestClient();
  const [screen, setScreen] = useState('register');

  const navigate = (screen: string) => {
    setScreen(screen);
  }

  const logout = async () => {
    await new User(user).logout();
    setUser(undefined);
  }

  const login = async (email: string, password: string) => {
    let u = new User(user) ?? new User();
    await u.login(email, password);
    setUser(u.getData());
  }

  const register = async (email: string, username: string , password: string ) => {
    const u = new User();
    u.username = username;
    u.email = email;
    u.password = password;
    await u.register();
    setUser(u);
  }

  const createConnectedSocket = async (): Promise<void> => {
    if (user) {
      const s = new SocketClient(user);
      await s.connect((disconnect) => {
        if (!disconnect) {
          setGame(s.gameData);
        }
        if (disconnect) {
          setError('Game was deleted');
          setGame(undefined);
          createConnectedSocket();
        }
      }, setError)
      setSocket(s);
      s.getGame();
      console.log('socket created')
    } else {
      setError('You are not connected to game');
    }
  }

  const checkForUser = async (): Promise<void> => {
    try {
      if (user) {
        return;
      }
      const u = new User()
      await u.getSessionUser();
      if (u.username && u.id && u.isActive) {
        setUser(u);
      }
      return;
    } catch (err) {
      return;
    }
  }

  const checkForGame = async (): Promise<void> => {
    try {
      if (!user.id || game) {
        return;
      }
      const g = await rest.makeRequest<GameResponse>({method: 'get', route: 'game'});
      if (g && g.key && user) {
        setGame(new Game(user));
      }
      return;
    } catch (err) {
      return;
    }
  }

  useEffect(() => {
    if (loading) {
      (async () => {
        await checkForUser();
        await checkForGame();
        setLoading(false);
      })()
    }
  }, []);

  if (loading) {
    return <Spinner/>;
  }

  if (user) {
    setScreen('home');
  }
  if (game) {
    setScreen('lobby');
  }
  if (game && game.active) {
    setScreen('game');
  }

  const renderScreen = () => {
    switch (screen) {
      case 'register':
        return <Register register={register} navigate={navigate}/>
      case 'login':
        return <Login login={login} navigate={navigate}/>
      case 'home':
        return <Home/>
      case 'lobby':
        return <Lobby game={game} socket={socket}/>
      case 'game':
        return <GameScreen game={game} socket={socket} user={user}/>
    }
  }

  return (
    <React.Fragment>
      <SetErrorContext.Provider value={setError}>
        <ErrorSnack open={!!error} message={error}/>
        <MenuAppBar game={game} socket={socket} logout={logout} user={user}/>
        {renderScreen()}
      </SetErrorContext.Provider>
    </React.Fragment>
  )
}

export default App;
