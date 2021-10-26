import React, {useState, useContext, useEffect} from "react";

import {Box, Button, Divider, Grid, Paper, Typography} from "@mui/material";
import SliderInput from "../components/SliderInput";
import {GameResponse} from "../clients/ResponseTypes";
import RestClient from "../clients/RestClient";
import SelectInputField from "../components/SelectInputField";

const SetupGame = () => {
  const [decks, setDecks] = useState(null);
  const [deck, setDeck] = useState('0');
  const [playerLimit, setPlayerLimit] = useState(3);
  const [rounds, setRounds] = useState(5);
  const [cardLimit, setCardLimit] = useState(6);
  const rest = new RestClient();



  const createGame = async () => {
    try {
      const gameOptions = {
        playCards: cardLimit,
        rounds,
        playerLimit,
        private: true,
        cardDeck: deck,
      }
      const game = await rest.makeRequest<GameResponse>({
        method: 'post',
        route: 'game',
        action: '',
        data: gameOptions,
      })
      if (!game) {
        // do something
        console.log('game create failed')
      }
    } catch (err) {
      console.log('errror', err)
    }
  }

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
              <Button variant={'outlined'} sx={{width: '100%'}} onClick={createGame}>Create Game</Button>
            </Box>
          </Grid>
        </Paper>
      </Box>
    </React.Fragment>
  );
}

export default SetupGame
