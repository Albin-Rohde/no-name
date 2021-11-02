import React from "react";

import {Box, Button, Grid, Typography} from "@mui/material";
import DataTable from "../../../components/DataTable";
import {useSelector} from "react-redux";
import {ReduxState} from "../../../redux/redux";
import Game from "../../../clients/Game";
import {SocketClient} from "../../../clients/SocketClient";

const Victory = () => {
  const game = useSelector<ReduxState, Game>((state) => state.game);
  const socket = useSelector<ReduxState, SocketClient>((state) => state.socket);

  const handleClick = () => {
    if (game.currentUser.isHost) {
      socket.deleteGame();
    } else {
      socket.leaveGame();
    }
  }

  return (
    <React.Fragment>
      <Grid container sx={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10vh'}}>
        <Grid item xs={9} sm={7} md={4}>
          <Typography variant={'h3'} align={'center'} color={'#8795ab'}>
            Final score
          </Typography>
          <Box sx={{marginTop: '5vh'}}>
            <DataTable sortByScore={true}/>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{marginTop: '2vh', marginBottom: '10vh', display: 'flex', justifyContent: 'center'}}>
        <Grid item xs={9} sm={7} md={2}>
          <Button
            color='error'
            variant={'outlined'}
            sx={{width: '100%'}}
            onClick={handleClick}
          >
            {game.currentUser.isHost ? 'Delete Game' : 'Leave game'}
          </Button>
        </Grid>
      </Box>
    </React.Fragment>
  );
}

export default Victory
