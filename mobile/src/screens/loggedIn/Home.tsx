import React, {useState, useContext, useEffect} from "react";

import { Box, Button, Grid, TextField, Tooltip } from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {ReduxState, setError} from "../../redux/redux";
import {UserData} from "../../clients/ResponseTypes";

interface HomeProps {
  setScreen: (screen: 'home' | 'create-game') => void;
}
const Home = (props: HomeProps) => {
  const [joinKey, setJoinKey] = useState('');
  const user = useSelector<ReduxState, UserData | null>((state) => state.user);
  const dispatch = useDispatch();

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
            <Button
              variant={'outlined'}
              sx={{width: '100%'}}
              onClick={() => dispatch(setError('Not implemented'))}
            >Join Game</Button>
          </Tooltip>
        </Grid>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '3vh'}}>
        <Grid item xs={8} sm={3} md={2}>
          <Button
            variant={'outlined'}
            sx={{width: '100%'}}
            onClick={() => props.setScreen('create-game')}
          >Create Game</Button>
        </Grid>
      </Box>
    </React.Fragment>
  );
}

export default Home
