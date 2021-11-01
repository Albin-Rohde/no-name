import React, {useEffect, useState} from "react";

import {CardResponse, GameResponse, UserData} from "../../../clients/ResponseTypes";
import {SocketClient} from "../../../clients/SocketClient";
import {useDispatch, useSelector} from "react-redux";
import {ReduxState, setError, setSocket, updateGame} from "../../../redux/redux";
import User from "../../../clients/User";
import * as GameClient from '../../../clients/Game';
import RestClient from "../../../clients/RestClient";
import Spinner from "../../../components/Spinner";
import Lobby from "./Lobby";
import * as GameScreen from './Game';
import MenuAppBar from "../../../components/MenuAppBar";

interface InGameProps {
  handleLogout: () => Promise<void>;
  setLoading: (l: boolean) => void;
  setLoggedInScreen: (screen: 'home' | 'create-game') => void;
  setHasGame: (has: boolean) => void;
}

const InGame = (props: InGameProps) => {
  const [loading, setLoading] = useState(true);
  const game = useSelector<ReduxState, GameClient.default>((state) => state.game);
  const user = useSelector<ReduxState, User>((state) => state.user);
  const socket = useSelector<ReduxState, SocketClient>((state) => state.socket);
  const dispatch = useDispatch();
  const rest = new RestClient();

  const onSocketError = (msg: string) => {
    console.log('socketErr')
    console.log(msg);
    dispatch(setError(msg));
  }
  const createConnectedSocket = async (): Promise<SocketClient> => {
    try {
      const socket = new SocketClient(user);
      await socket.connect((disconnect) => {
        if (disconnect) {
          setError('SOCKET DISCONNECT')
          dispatch(updateGame(null));
          dispatch(setSocket(null));
          props.setLoggedInScreen('home');
          props.setHasGame(false);
          props.setLoading(false);
          return;
        }
        console.log('game updated')
        dispatch(updateGame(socket.gameData));
        if (loading) {
          setLoading(false);
        }
      }, onSocketError)
      return socket;
    } catch (err) {
      setError(err.message);
    }
  }
  const checkForGame = async () => {
    try {
      const game = await rest.makeRequest<GameResponse>({method: 'get', route: 'game'});
      return !!game.key;
    } catch (err) {
      return false;
    }
  }
  const deleteGame = () => {
    if (game && game.currentUser.isHost) {
      socket.deleteGame();
      setLoading(true);
      props.setHasGame(false);
      dispatch(updateGame(null));
    }
  }
  useEffect(() => {
    (async () => {
      if (! await checkForGame) {
        dispatch(setError('You are not connected to any game'));
        dispatch(updateGame(null));
      }
      const s = await createConnectedSocket();
      if (s) {
        s.getGame();
        dispatch(setSocket(s));
      }
    })()
  }, [])

  if (loading) {
    return <Spinner/>
  }

  const renderScreen = () => {
    if (game && game.active) {
      return <GameScreen.default/>
    } else {
      return <Lobby setLoading={setLoading}/>
    }
  }

  return (
    <React.Fragment>
      <MenuAppBar user={user} logout={props.handleLogout} deleteGame={deleteGame}/>
      {renderScreen()}
    </React.Fragment>
  )
}

export default InGame;
