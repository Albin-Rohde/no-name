import React, {useEffect, useState} from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  ReduxState,
  setError,
  updateUser,
} from "../../redux/redux";
import User from "../../clients/User";
import Spinner from "../../components/Spinner";
import RestClient from "../../clients/RestClient";
import {GameResponse} from "../../clients/ResponseTypes";
import MenuAppBar from "../../components/MenuAppBar";
import Home from "./Home";
import SetupGame from "./SetupGame";
import InGame from "./inGame/InGame";
import JoinGame from "./inGame/JoinGame";
import {Route, Switch, useHistory} from "react-router-dom";
import {ManageDecks} from "./ManageDecks";
import {NewDeck} from "./NewDeck";

const LoggedIn = () => {
  const [loading, setLoading] = useState(true);
  const [hasGame, setHasGame] = useState(false);
  const user = useSelector<ReduxState, User | null>((state) => state.user);
  const rest = new RestClient();
  const dispatch = useDispatch();
  const history = useHistory();

  const setScreen = (screen: 'home' | 'create-game' | 'decks'  | 'new-deck' | 'game', id?: string) => {
    history.push(id ? `/${screen}/${id}` : `/${screen}`)
  }

  if (!user) {
    dispatch(setError('You are not logged in'))
  }
  const checkForGame = async () => {
    try {
      const game = await rest.makeRequest<GameResponse>({method: 'get', route: 'game'});
      return !!game.key;
    } catch (err) {
      return false;
    }
  }
  const handleLogout = async () => {
    try {
      await rest.makeRequest({method: 'post', route: 'user', action: 'logout'});
      dispatch(updateUser(null));
    } catch (err) {
      setError(err.message);
    }
  }
  useEffect(() => {
    setScreen('home');
    (async () => {
      const userHaveGame = await checkForGame();
      if (!userHaveGame) {
        setLoading(false);
        return;
      } else {
        setScreen('game')
        setHasGame(true);
        setLoading(false);
      }
    })()
  }, [])


  if (loading && !hasGame) {
    return <Spinner/>
  }

  return (
    <React.Fragment>
      <Switch>
        <Route path={"/game"}>
          <InGame
            handleLogout={handleLogout}
            setLoggedInScreen={setScreen}
            setHasGame={setHasGame}
            setLoading={setLoading}
          />
        </Route>
      </Switch>
      <Switch>
        <Route path={"/join"}>
        <MenuAppBar user={user} logout={handleLogout}/>
          <JoinGame/>
        </Route>
        <Route path={"/home"}>
          <MenuAppBar user={user} logout={handleLogout}/>
          <Home setScreen={setScreen}/>
        </Route>
        <Route path={"/create-game"}>
          <MenuAppBar user={user} logout={handleLogout}/>
          <SetupGame setScreen={setScreen}/>
        </Route>
        <Route path={"/decks"}>
          <MenuAppBar user={user} logout={handleLogout}/>
          <ManageDecks user={user} setScreen={setScreen}/>
        </Route>
        <Route path={"/new-deck"}>
          <MenuAppBar user={user} logout={handleLogout}/>
          <NewDeck setScreen={setScreen}/>
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default LoggedIn
