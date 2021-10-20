import React, {useContext, useEffect, useState} from 'react'
import {Box, Button, Container, Grid, TextField, Typography} from "@mui/material";
import {Link, useHistory} from 'react-router-dom';
import { GameHandlerContext } from "../App";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const state = useContext(GameHandlerContext);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        if (state.user) {
          history.push('/');
        }
      } catch (err) {};
    })()
  }, [state.user])

  return(
    <Container>
      <Typography variant='h4' style={{color: 'white', textAlign: 'center', marginTop: '20vh'}}>
        No-Name Game
      </Typography>
      <Grid container marginTop='18vh'>
        <Grid item xs={2} sm={3} md={4}/>
        <Grid item xs={8} sm={6} md={4}>
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Grid item xs={12} md={10}>
              <TextField
                value={name}
                variant='standard'
                onChange={(e) => {
                  e.preventDefault()
                  setName((e.target.value))
                }}
                style={{width: '100%', marginBottom: '2vh'}}
                placeholder="Username"
              />
              <TextField
                value={email}
                variant='standard'
                onChange={(e) => {
                  e.preventDefault()
                  setEmail((e.target.value))
                }}
                style={{width: '100%', marginBottom: '2vh'}}
                placeholder="Email"
              />
              <TextField
                value={password}
                variant='standard'
                type='password'
                onChange={(e) => {
                  e.preventDefault()
                  setPassword(e.target.value)
                }}
                style={{width: '100%', marginBottom: '2vh'}}
                placeholder="Password"
              />
            </Grid>
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Grid item xs={12} md={10}>
              <Button variant="outlined" style={{width: '100%', marginTop: '1vh'}} onClick={() => state.register(email, password, name)}>Register</Button>
              <Typography variant='body1' align='left' sx={{marginTop: '3vh', color: 'white'}}>
                Have an account? <Link style={{cursor: 'pointer', color: '#799ac7'}} to={'/login'}>Login</Link>
              </Typography>
            </Grid>
          </Box>
          <Grid item xs={2} sm={3} md={4}/>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Register;
