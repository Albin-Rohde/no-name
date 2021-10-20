import React, {useState, useContext, useEffect} from "react";

import {Box, Button, Card, Grid, Typography, Paper, TextField} from "@mui/material";
import {GameHandlerContext} from "../../App";
import Spinner from "../../components/Spinner";
import DataTable from "../../components/DataTable";
import {useHistory} from "react-router-dom";

const Lobby = () => {
  const state = useContext(GameHandlerContext);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const handleStartGame = () => {
    console.log('start game...')
    state.socket.startGame();
  }
  useEffect(() => {
    (async () => {
      if (!loading) {
        if (state.game.active) {
          history.push('/game');
        }
        return;
      }
      await state.userRequired();
      await state.gameRequired();
      if (state.user && state.socket) {
        if (state.game) {
          if (state.game.active) {
            history.push('/game');
          }
          setLoading(false);
          return;
        } else {
          state.socket.getGame();
        }
      }
    })();
  }, [state.user, state.game, state.socket])

  if (loading) {
    return (<Spinner/>)
  }

  return (
    <React.Fragment>
      <Typography variant={'h4'} align={'center'} color={'#8795ab'} sx={{marginTop: '15vh'}}>
        Waitning for players
      </Typography>
      <Typography variant={'body1'} align={'center'} color={'#8795ab'}>
        ({state.game.users.length} / {state.game.gameOptions.playerLimit})
      </Typography>
      <Grid container sx={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10vh'}}>
        <Grid item xs={9} sm={7} md={4}>
          <DataTable users={state.game.users}/>
        </Grid>
      </Grid>
      <Box sx={{marginTop: '3vh', display: 'flex', justifyContent: 'center'}}>
        <Grid item xs={9} sm={7} md={4} sx={{marginTop: '7vh'}}>
          <TextField
            value={state.game.key}
            variant='outlined'
            label='game key'
            style={{width: '70%', marginBottom: '2vh'}}
          />
          <Button
            variant={'outlined'}
            sx={{width: '29%', height: '56px'}}
            onClick={() => {navigator.clipboard.writeText(state.game.key)}}
          >
            Copy
          </Button>
        </Grid>
      </Box>
      <Box sx={{marginTop: '2vh', display: 'flex', justifyContent: 'center'}}>
        <Grid item xs={9} sm={7} md={2}>
          <Button variant={'outlined'} sx={{width: '100%'}} onClick={handleStartGame} >Start Game</Button>
        </Grid>
      </Box>
      <Box sx={{marginTop: '2vh', marginBottom: '10vh', display: 'flex', justifyContent: 'center'}}>
        <Grid item xs={9} sm={7} md={2}>
          <Button variant={'outlined'} sx={{width: '100%'}} >Delete Game</Button>
        </Grid>
      </Box>
    </React.Fragment>
  );
}

export default Lobby
