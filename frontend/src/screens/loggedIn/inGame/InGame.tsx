import React, {useEffect, useState} from "react";

import {GameResponse} from "../../../clients/ResponseTypes";
import {SocketClient} from "../../../clients/SocketClient";
import {useDispatch, useSelector} from "react-redux";
import {ReduxState, setError, setSocket, setWarning, updateGame} from "../../../redux/redux";
import User from "../../../clients/User";
import * as GameClient from '../../../clients/Game';
import RestClient from "../../../clients/RestClient";
import Spinner from "../../../components/Spinner";
import Lobby from "./Lobby";
import * as GameScreen from './Game';
import MenuAppBar from "../../../components/MenuAppBar";
import {GameRuleError} from "../../../clients/error";
import Victory from "./Victory";

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

  const onSocketError = (err: unknown) => {
    if (err instanceof Error) {
      if (err instanceof GameRuleError && err.message) {
        dispatch(setWarning(err.message));
      } else if (err.message) {
        dispatch(setError(err.message));
      }
    }
  }

  const createConnectedSocket = async (): Promise<SocketClient> => {
    try {
      const socket = new SocketClient(user);
      await socket.connect((disconnect) => {
        if (disconnect) {
          setLoading(true);
          props.setHasGame(false);
          props.setLoggedInScreen('home');
          props.setHasGame(false);
          props.setLoading(false);
          dispatch(updateGame(null));
          dispatch(setSocket(null));
          return;
        }
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
    if (game && game.isFinished) {
      return <Victory/>
    }
    if (game && game.active) {
      return <GameScreen.default/>
    }
    return <Lobby setLoading={setLoading}/>
  }

  return (
    <React.Fragment>
      <MenuAppBar user={user} logout={props.handleLogout} deleteGame={deleteGame}/>
      {renderScreen()}
    </React.Fragment>
  )
}

export default InGame;
