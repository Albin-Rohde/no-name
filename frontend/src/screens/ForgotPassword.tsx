import React, {useState} from 'react'
import {Box, Button, Container, Grid, TextField, Typography} from "@mui/material";
import RestClient from "../clients/RestClient";
import {useDispatch} from "react-redux";
import {setError, setNotification} from "../redux/redux";
import Logo from "../components/Logo";

interface ForgotPasswordProps {
  navigate: (screen: string) => void;
}

const ForgotPassword = (props: ForgotPasswordProps) => {
  const [email, setEmail] = useState("")
  const rest = new RestClient()
  const dispatch = useDispatch();

  const sendReset = async () => {
    try {
      await rest.makeRequest({
        method: 'post',
        route: 'user',
        action: 'send-reset',
        data: {email}
      })
      dispatch(setNotification('You will receive an email shortly'));
    } catch (err) {
      dispatch(setError(err.message));
    }
  }

  return(
    <Container>
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '14vh'}}>
        <Logo/>
      </Box>
      <Grid container marginTop='10vh'>
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
            </Grid>
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Grid item xs={12} md={10}>
              <Button variant="outlined" style={{width: '100%', marginTop: '1vh'}} onClick={sendReset}>Send reset email</Button>
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

export default ForgotPassword;
