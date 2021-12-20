import React, {useEffect, useState} from 'react';
import { Route, Switch } from "react-router-dom";
import './App.css';
import Register from "./screens/Register";
import ErrorSnack from "./components/ErrorSnack";
import Login from "./screens/Login";
import MenuAppBar from "./components/MenuAppBar";
import RestClient from "./clients/RestClient";
import Spinner from "./components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import {ReduxState, updateUser, setError, updateGame, notification} from "./redux/redux";
import { UserData} from "./clients/ResponseTypes";
import User from "./clients/User";
import LoggedIn from "./screens/loggedIn/LoggedIn";
import WarningSnack from "./components/WarningSnack";
import NotificationSnack from "./components/NotificationSnack";
import Reset from "./screens/Reset";
import ForgotPassword from "./screens/ForgotPassword";
import JoinGame from "./screens/loggedIn/inGame/JoinGame";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [screen, setScreen] = useState<'register' | 'login' | 'forgot'>('register');
  const [longPollActive, setLongPollActive] = useState<boolean>(false);
  const user = useSelector<ReduxState, User | undefined>((state) => state.user);
  const error = useSelector<ReduxState, string>((state) => state.error);
  const warning = useSelector<ReduxState, string>((state) => state.warning);
  const notification = useSelector<ReduxState, string>((state) => state.notification);
  const dispatch = useDispatch();
  const rest = new RestClient();

  const navigate = (screen: 'login' | 'register' | 'forgot') => {
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

  const longPollUser = async () => {
    let keepPolling = true;
    while (keepPolling) {
      await new Promise<void>(async (resolve) => {
        setTimeout(async () => {
          try {
            const userData = await rest.makeRequest<UserData>({method: 'get', route: 'user', action: 'get'});
            if (!userData || !userData.id) {
              throw new Error('You are not logged in');
            }
            resolve();
          } catch (err) {
            dispatch(updateGame(null))
            dispatch(updateUser(null))
            dispatch(setError(err.message));
            keepPolling = false;
            resolve();
          }
        }, 60000);
      })
    }
  }

  useEffect(() => {
    (async () => {
      await fetchUser();
      setLoading(false);
    })()
  }, []);

  useEffect(() => {
    if (user && user.id && !longPollActive) {
      longPollUser();
      setLongPollActive(true);
    }
  }, [user])

  if (loading) {
    return <Spinner/>;
  }

  if (user) {
    return (
      <React.Fragment>
        <ErrorSnack open={!!error} message={error}/>
        <WarningSnack open={!!warning} message={warning}/>
        <NotificationSnack open={!!notification} message={notification}/>
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
      case 'forgot':
        return <ForgotPassword navigate={navigate}/>
      default:
        return <Register register={register} navigate={navigate}/>
    }
  }

  return (
    <React.Fragment>
      <ErrorSnack open={!!error} message={error}/>
      <WarningSnack open={!!warning} message={warning}/>
      <NotificationSnack open={!!notification} message={notification}/>
      <MenuAppBar/>
      <Switch>
        <Route path={"/reset"}>
          <Reset/>
        </Route>
        <Route path={"/join"}>
          <JoinGame/>
        </Route>
        <Route path={"/"}>
          {renderScreen()}
        </Route>
      </Switch>
    </React.Fragment>
  )
}

export default App;
