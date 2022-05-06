import React, {useState, useEffect} from "react";

import {Box, Button, Grid, Paper, Tooltip, Typography} from "@mui/material";
import SliderInput from "../../components/SliderInput";
import {CardDeckResponse, GameResponse} from "../../clients/ResponseTypes";
import RestClient from "../../clients/RestClient";
import SelectInputField from "../../components/SelectInputField";
import {useDispatch, useSelector} from "react-redux";
import {ReduxState, setError, updateGame} from "../../redux/redux";
import Game from "../../clients/Game";
import User from "../../clients/User";
import {useHistory} from "react-router-dom";

interface SetupGameProps {
  setScreen: (screen: 'home' | 'create-game') => void;
}
const SetupGame = (props: SetupGameProps) => {
  const [decks, setDecks] = useState<CardDeckResponse[]>([]);
  const [deck, _setDeck] = useState<number>(0);
  const [playerLimit, _setPlayerLimit] = useState(3);
  const [rounds, _setRounds] = useState(5);
  const [cardLimit, _setCardLimit] = useState(6);
  const [tooManyCards, setTooManyCards] = useState<boolean>(false);
  const user = useSelector<ReduxState, User | undefined>((state) => state.user);
  const history = useHistory();
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
      history.push('/game')
    } catch (err) {
      dispatch(setError(err.message));
    }
  }
  const fetchDecks = async () => {
    try {
      const decks = await rest.makeRequest<CardDeckResponse[]>({method: 'get', route: 'deck', action: 'library'});
      setDecks(decks);
      if (decks[0]) {
        setDeck(decks[0].id)
      }
    } catch (err) {
      dispatch(setError(err.message));
    }
  }

  const cardsRequired = (): number => {
    const handOut = playerLimit * cardLimit;
    const perRound = (playerLimit - 1) * cardLimit;
    return handOut + (perRound * rounds);
  }

  const setPlayerLimit = (val: number): void => {
    _setPlayerLimit(val);
    const selectedDeck = decks.find((d) => d.id == deck)
    if (selectedDeck) {
      setTooManyCards(cardsRequired() > selectedDeck.cardsCount)
    }
  }

  const setRounds = (val: number): void => {
    _setRounds(val);
    const selectedDeck = decks.find((d) => d.id == deck)
    if (selectedDeck) {
      setTooManyCards(cardsRequired() > selectedDeck.cardsCount)
    }
  }

  const setCardLimit = (val: number): void => {
    _setCardLimit(val);
    const selectedDeck = decks.find((d) => d.id == deck)
    if (selectedDeck) {
      setTooManyCards(cardsRequired() > selectedDeck.cardsCount)
    }
  }

  const setDeck = (id: number): void => {
    _setDeck(id);
    const selectedDeck = decks.find((d) => d.id == id)
    if (selectedDeck) {
      setTooManyCards(cardsRequired() > selectedDeck.cardsCount)
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
              <Tooltip
                title={tooManyCards ?
                  'too many players, cards or rounds for selected deck, please decrease one of them' :
                  ''}
              >
                <span>
                  <Button disabled={tooManyCards} color='success' variant={'outlined'} sx={{width: '100%'}} onClick={createGame}>Create Game</Button>
                </span>
              </Tooltip>
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
