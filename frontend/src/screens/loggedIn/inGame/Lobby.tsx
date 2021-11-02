import React from "react";

import {Box, Button, Grid, Typography, TextField} from "@mui/material";
import DataTable from "../../../components/DataTable";
import {useSelector} from "react-redux";
import {ReduxState} from "../../../redux/redux";
import Game from "../../../clients/Game";
import {SocketClient} from "../../../clients/SocketClient";

interface LobbyProps {
  setLoading: (l: boolean) => void;
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
  const game = useSelector<ReduxState, Game>((state) => state.game);
  const socket = useSelector<ReduxState, SocketClient>((state) => state.socket);

  const startGame = () => {
    props.setLoading(true);
    socket.startGame();
  }
  return (
    <React.Fragment>
      <Typography variant={'h4'} align={'center'} color={'#8795ab'} sx={{marginTop: '15vh'}}>
        Waitning for players
      </Typography>
      <Typography variant={'body1'} align={'center'} color={'#8795ab'}>
        ({game.users.length} / {game.gameOptions.playerLimit})
      </Typography>
      <Grid container sx={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10vh'}}>
        <Grid item xs={9} sm={7} md={4}>
          <DataTable/>
        </Grid>
      </Grid>
      <Box sx={{marginTop: '3vh', display: 'flex', justifyContent: 'center'}}>
        <Grid item xs={9} sm={7} md={4} sx={{marginTop: '7vh'}}>
          <TextField
            value={game.joinKey}
            variant='outlined'
            label='game key'
            style={{width: '70%', marginBottom: '2vh'}}
          />
          <Button
            variant={'outlined'}
            sx={{width: '29%', height: '56px'}}
            onClick={() => copyText(game.joinKey)}
          >
            Copy
          </Button>
        </Grid>
      </Box>
      {game.currentUser.isHost && (
        <React.Fragment>
          <Box sx={{marginTop: '2vh', display: 'flex', justifyContent: 'center'}}>
            <Grid item xs={9} sm={7} md={2}>
              <Button
                color='success'
                variant={'outlined'}
                sx={{width: '100%'}}
                onClick={startGame}
              >Start Game</Button>
            </Grid>
          </Box>
          <Box sx={{marginTop: '2vh', marginBottom: '10vh', display: 'flex', justifyContent: 'center'}}>
            <Grid item xs={9} sm={7} md={2}>
              <Button
                color='error'
                variant={'outlined'}
                sx={{width: '100%'}}
                onClick={() => socket.deleteGame()}
              >Delete Game</Button>
            </Grid>
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default Lobby
