import React from "react";

import {Box, Button, Card, Grid, Typography, Paper, TextField} from "@mui/material";
import DataTable from "../../components/DataTable";
import Game from "../../clients/Game";
import {SocketClient} from "../../clients/SocketClient";


interface LobbyProps {
  game: Game;
  socket: SocketClient;
}

const Lobby = (props: LobbyProps) => {
  const copyText = (value: string) => {
    const input = document.body.appendChild(document.createElement("input"))
    input.value = value
    input.focus();
    input.select();
    document.execCommand('copy')
    input.parentNode.removeChild(input)
  }

  return (
    <React.Fragment>
      <Typography variant={'h4'} align={'center'} color={'#8795ab'} sx={{marginTop: '15vh'}}>
        Waitning for players
      </Typography>
      <Typography variant={'body1'} align={'center'} color={'#8795ab'}>
        ({props.game.users.length} / {props.game.gameOptions.playerLimit})
      </Typography>
      <Grid container sx={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10vh'}}>
        <Grid item xs={9} sm={7} md={4}>
          <DataTable users={props.game.users}/>
        </Grid>
      </Grid>
      <Box sx={{marginTop: '3vh', display: 'flex', justifyContent: 'center'}}>
        <Grid item xs={9} sm={7} md={4} sx={{marginTop: '7vh'}}>
          <TextField
            value={props.game.key}
            variant='outlined'
            label='game key'
            style={{width: '70%', marginBottom: '2vh'}}
          />
          <Button
            variant={'outlined'}
            sx={{width: '29%', height: '56px'}}
            onClick={() => copyText(props.game.key)}
          >
            Copy
          </Button>
        </Grid>
      </Box>
      <Box sx={{marginTop: '2vh', display: 'flex', justifyContent: 'center'}}>
        <Grid item xs={9} sm={7} md={2}>
          <Button variant={'outlined'} sx={{width: '100%'}} onClick={() => console.log('start game')} >Start Game</Button>
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
