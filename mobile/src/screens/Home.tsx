import React, {useState, useContext, useEffect} from "react";

import { Box, Button, Grid, TextField, Tooltip } from "@mui/material";
import {useHistory} from "react-router-dom";

const Home = () => {
  const [joinKey, setJoinKey] = useState('');
  const history = useHistory();

  return (
    <React.Fragment>
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '40vh'}}>
        <Grid item xs={8} sm={3} md={2}>
          <TextField
            value={joinKey}
            variant='outlined'
            label='game key'
            onChange={(e) => {
              e.preventDefault()
              setJoinKey((e.target.value))
            }}
            style={{width: '100%', marginBottom: '2vh'}}
          />
        </Grid>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '0vh'}}>
        <Grid item xs={8} sm={3} md={2}>
          <Tooltip title="it is also possible to join via invite link">
            <Button variant={'outlined'} sx={{width: '100%'}} onClick={() => console.log('join game')}>Join Game</Button>
          </Tooltip>
        </Grid>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '3vh'}}>
        <Grid item xs={8} sm={3} md={2}>
          <Button variant={'outlined'} sx={{width: '100%'}} onClick={() => history.push('/create-game')}>Start Game</Button>
        </Grid>
      </Box>
    </React.Fragment>
  );
}

export default Home
