import React, {useEffect, useState} from 'react';

import Home from "./screens/loggedIn/Home";
import './App.css';
import Register from "./screens/Register";
import ErrorSnack from "./components/ErrorSnack";
import Login from "./screens/Login";
import MenuAppBar from "./components/MenuAppBar";
import RestClient from "./clients/RestClient";
import Spinner from "./components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState, updateUser, setError } from "./redux/redux";
import { UserData} from "./clients/ResponseTypes";
import User from "./clients/User";
import LoggedIn from "./screens/loggedIn/LoggedIn";

export const SetErrorContext = React.createContext(null);

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [screen, setScreen] = useState<'register' | 'login'>('register');
  const user = useSelector<ReduxState, User | undefined>((state) => state.user);
  const error = useSelector<ReduxState, string>((state) => state.error);
  const dispatch = useDispatch();
  const rest = new RestClient();

  const navigate = (screen: 'login' | 'register') => {
    setScreen(screen)
  }

  const login = async (email: string, password: string) => {
    try {
      const userData = await rest.makeRequest<UserData>({
        method: 'post',
        route: 'user',
        data: { email, password },
        action: 'login',
      })
      if (userData && userData.id != null) {
        const u = new User(userData);
        dispatch(updateUser(u));
      }
    } catch (err) {
      dispatch(setError(err.message))
    }
  }

  const logout = async () => {
    try {
      await rest.makeRequest({
        method: 'post',
        route: 'user',
        action: 'logout',
      })
      dispatch(updateUser(null));
    } catch (err) {
      dispatch(setError(err.message))
    }
  }

  const register = async (email: string, username: string , password: string ) => {
    try {
      const userData = await rest.makeRequest<UserData>({
        method: 'post',
        route: 'user',
        data: {
          email,
          password,
          username,
        },
        action: 'register',
      })
      const u = new User(userData);
      dispatch(updateUser(u));
    } catch (err) {
      dispatch(setError(err.message))
    }
  }

  const fetchUser = async () => {
    try {
      const userData = await rest.makeRequest<UserData>({method: 'get', route: 'user', action: 'get'})
      if (userData.id) {
        const u = new User(userData);
        dispatch(updateUser(u));
      }
    } catch (err) {
      return;
    }
  }

  useEffect(() => {
    (async () => {
      await fetchUser();
      setLoading(false);
    })()
  }, []);

  if (loading) {
    return <Spinner/>;
  }

  if (user) {
    return (
      <React.Fragment>
        <LoggedIn/>
      </React.Fragment>
    )
  }

  const renderScreen = () => {
    switch (screen) {
      case 'register':
        return <Register register={register} navigate={navigate}/>
      case 'login':
        return <Login login={login} navigate={navigate}/>
      default:
        return <Register register={register} navigate={navigate}/>
    }
  }

  return (
    <React.Fragment>
      <ErrorSnack open={!!error} message={error}/>
      <MenuAppBar/>
      {renderScreen()}
    </React.Fragment>
  )
}

export default App;
/*
  case 'home':
    return <Home/>
  case 'lobby':
    return <Lobby game={game} socket={socket}/>
  case 'create-game':
    return <SetupGame />
  case 'game':
    return <GameScreen game={game} socket={socket} user={user}/>
*/
