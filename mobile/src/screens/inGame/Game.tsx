import React, {useState, useContext, useEffect} from "react";

import {Box, Button, Card, Grid, Typography, Paper, TextField, CardContent} from "@mui/material";
import {GameHandlerContext} from "../../App";
import Spinner from "../../components/Spinner";
import {useHistory} from "react-router-dom";
import PlayerDrawer from "../../components/PlayerDrawer";
import DataTable from "../../components/DataTable";

const Game = () => {
  const state = useContext(GameHandlerContext);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (!loading) {
        return;
      }
      await state.userRequired();
      await state.gameRequired();
      if (state.user && state.socket) {
        if (state.game) {
          if (!state.game.active) {
            history.push('/lobby');
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

  const cards = () => {
    return state.game.cardsOnHand.map((card) => {
      return (
        <Card sx={{
          marginRight: isMobile ? '2%' : '5px',
          marginLeft: isMobile ? '2%' : '5px',
          minHeight: '250px',
          minWidth: isMobile ? '200px' : '12%',
          maxWidth: isMobile ? '200px' : '12%',
          backgroundColor: '#505050',
          scrollSnapAlign: 'center',
        }}>
          <CardContent>
            <Typography variant={'h5'}>
              {card.text}
            </Typography>
          </CardContent>
        </Card>
      )
    })
  }

  const isMobile = window.screen.width < 800;
  console.log(isMobile)
  return (
    <React.Fragment>
      <Grid container sx={{width: '100%', marginTop: '6vh'}}>
        {!isMobile ?
          <Grid item xs={2} sm={2} md={3} sx={{display: 'flex', justifyContent: 'center'}}>
            <Box sx={{width: '80%', marginTop: '5vh'}}>
              <DataTable users={state.game.users}/>
            </Box>
          </Grid> : <Grid item xs={2} sm={2} md={3}/>
        }
        <Grid item xs={8} sm={6} md={6} sx={{display: 'flex', justifyContent: 'center'}}>
          <Card sx={{minHeight: '250px', minWidth: '200px', maxWidth: '200px'}}>
            <CardContent>
              <Typography variant={'h5'}>
                {state.game.blackCard.text}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {isMobile && <PlayerDrawer open={false} users={state.game.users}/>}
      </Grid>
      {isMobile ? (
        <Box sx={{
          display: 'flex',
          marginTop: '14vh',
          overflow: 'scroll',
          scrollSnapType: 'x mandatory',
        }}>
          {cards()}
        </Box>
      ) : (
        <Box sx={{display: 'flex', marginTop: '14vh'}}>
          {cards()}
        </Box>
      )}
      <Grid item sm={3} md={4}/>
    </React.Fragment>
  );
}

export default Game;
