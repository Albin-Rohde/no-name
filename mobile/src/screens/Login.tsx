import React, {useState} from 'react'
import {Box, Button, Container, Grid, TextField, Typography} from "@mui/material";

interface LoginProps {
  login: (email: string, password: string) => Promise<void>;
  navigate: (screen: string) => void;
}

const Login = (props: LoginProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    props.login(email, password)
  }

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
              <Button variant="outlined" style={{width: '100%', marginTop: '1vh'}} onClick={handleLogin}>Login</Button>
              <Typography variant='body1' align='left' sx={{marginTop: '3vh', color: 'white'}}>
                Dont have an account yet? <Typography variant='body1' style={{cursor: 'pointer', color: '#799ac7'}} onClick={() => props.navigate('register')}>Register</Typography>
              </Typography>
            </Grid>
          </Box>
          <Grid item xs={2} sm={3} md={4}/>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Login;
