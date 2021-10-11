import React, {useEffect, useState} from 'react';

import Home from "./screens/Home";
import './App.css';
import User from "./clients/User";
import {SocketClient} from "./clients/SocketClient";
import Game from "./clients/Game";
import RestClient from "./clients/RestClient";
import {GameResponse} from "./clients/ResponseTypes";
import {Route, Switch} from 'react-router-dom'
import Register from "./screens/Register";
import GameScreen from './screens/Game'


function App() {
  const [loggedIn, setLoggedI] = useState(false)
  const user = new User()
  let socket: SocketClient;

  useEffect(() => {
    (async () => {
    const getUser = async () => {
      await user.login('hej123', 'hej123');
    }
    await getUser()
    socket = new SocketClient(user);
  const game = new Game(user)

    const gameSettings: any = {
      playCards: 5,
      rounds: 3,
      playerLimit: 2,
      private: true,
      cardDeck: 1
    }
    const createGame = async () => {
      const rest = new RestClient()
      const gameData = await rest.makeRequest<GameResponse>({
        method: 'post',
        route: 'game',
        data: gameSettings,
      })
      return gameData
    }
      const data = await createGame()
      console.log((data))
      await socket.connect(async () => {
        console.log("hello")
    })
    })()
  }, [])

  return (
    <Switch>
      {loggedIn ? (
        <Route
          exact={true}
          path={'/game'}
          component={GameScreen}
        />
      )  : (
        <Route
          exact={true}
          path={"/register"}
          component={Register}
        />
      )}
        <Route path="/" component={Home} />
    </Switch>
  );
}

export default App;
