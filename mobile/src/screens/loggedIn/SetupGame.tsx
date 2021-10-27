import React, {useState, useContext, useEffect} from "react";

import {Box, Button, Divider, Grid, Paper, Typography} from "@mui/material";
import SliderInput from "../../components/SliderInput";
import {CardDeckResponse, GameResponse} from "../../clients/ResponseTypes";
import RestClient from "../../clients/RestClient";
import SelectInputField from "../../components/SelectInputField";
import {useDispatch, useSelector} from "react-redux";
import {ReduxState, setError, updateGame, updateScreen} from "../../redux/redux";
import Game from "../../clients/Game";
import User from "../../clients/User";

interface SetupGameProps {
  setScreen: (screen: 'home' | 'create-game') => void;
}
const SetupGame = (props: SetupGameProps) => {
  const [decks, setDecks] = useState(null);
  const [deck, setDeck] = useState('0');
  const [playerLimit, setPlayerLimit] = useState(3);
  const [rounds, setRounds] = useState(5);
  const [cardLimit, setCardLimit] = useState(6);
  const user = useSelector<ReduxState, User | undefined>((state) => state.user);
  const rest = new RestClient();

  const dispatch = useDispatch();

  const createGame = async () => {
    try {
      const gameOptions = {
        playCards: cardLimit,
        rounds,
        playerLimit,
        private: true,
        cardDeck: deck,
      }
      const g = await rest.makeRequest<GameResponse>({
        method: 'post',
        route: 'game',
        data: gameOptions,
      })
      if (!g) {
        dispatch(setError('Failed creating game'));
      }
      const newGame = new Game(user.getData());
      dispatch(updateGame(newGame))
    } catch (err) {
      dispatch(setError(err.message));
    }
  }
  const fetchDecks = async () => {
    try {
      const decks = await rest.makeRequest<CardDeckResponse[]>({method: 'get', route: 'card', action: 'decks'});
      setDecks(decks);
      if (decks[0]) {
        setDeck(decks[0].id.toString())
      }
    } catch (err) {
      dispatch(setError(err.message));
    }
  }

  useEffect(() => {
    fetchDecks();
  }, [])

  return (
    <React.Fragment>
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '25vh'}}>
        <Paper variant="outlined" sx={{backgroundColor: '#282c34', padding: '3vw'}}>
          <Typography color={'#8795ab'} sx={{marginTop: '-2vw'}}>
            Setup Game
          </Typography>
          <Grid item xs={8} sm={3} md={2} sx={{marginTop: '2vw'}}>
            <SliderInput
              min={3}
              max={8}
              default={3}
              title={'players'}
              setValue={setPlayerLimit}
              value={playerLimit}
            />
            <SliderInput
              min={3}
              max={8}
              default={5}
              title={'rounds'}
              setValue={setRounds}
              value={rounds}
            />
            <SliderInput
              min={3}
              max={8}
              default={6}
              title={'cards'}
              setValue={setCardLimit}
              value={cardLimit}
            />
            <SelectInputField decks={decks} value={deck} setValue={setDeck}/>
            <Box width={250} sx={{marginTop: '3vh'}}>
              <Button color='success' variant={'outlined'} sx={{width: '100%'}} onClick={createGame}>Create Game</Button>
            </Box>
            <Box width={250} sx={{marginTop: '1vh'}}>
              <Button color='error' variant={'outlined'} sx={{width: '100%'}} onClick={() => props.setScreen('home')}>Cancel</Button>
            </Box>
          </Grid>
        </Paper>
      </Box>
    </React.Fragment>
  );
}

export default SetupGame
