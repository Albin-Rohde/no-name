import React, {useContext, useEffect, useState} from 'react'
import {Box, Button, Container, Grid, TextField, Typography} from "@mui/material";
import RestClient from "../clients/RestClient";
import {Redirect, useHistory} from "react-router-dom";
import {setError, setNotification} from "../redux/redux";
import {useDispatch} from "react-redux";

interface UserData {
  username: string,
  email: string,
  id: number,
}
const Reset = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redirect, setRedirect] = useState(null);
  const [userId, setUserId] = useState<number>(null);
  const dispatch = useDispatch();
  const rest = new RestClient();

  useEffect(() => {
    (async () => {
      try {
        const resetKey = window.location.pathname.split('/')[2];
        const userData = await rest.makeRequest<UserData>({
          method: 'get',
          route: 'user',
          action: `reset/${resetKey}`
        });
        setName(userData.username)
        setEmail(userData.email)
        setUserId(userData.id);
      } catch (err) {
        dispatch(setError(err.message))
        setRedirect('/');
      }
    })();
  }, []);

  if (redirect) {
    return <Redirect to={redirect}/>
  }

  const updatePassword = async () => {
    if (password !== confirmPassword) {
      dispatch(setError('Password missmatch'));
      return;
    }
    const resetKey = window.location.pathname.split('/')[2];
    try {
      await rest.makeRequest({
        method: 'post',
        route: 'user',
        action: `reset/${resetKey}`,
        data: {id: userId, password}
      });
      setRedirect('/');
      dispatch(setNotification('Password updated'))
    } catch (err) {
      dispatch(setError(err.message))
      setRedirect('/');
    }
  }

  return(
    <Container>
      <Typography variant='h4' style={{color: 'white', textAlign: 'center', marginTop: '20vh'}}>
        Change password
      </Typography>
      <Grid container marginTop='18vh'>
        <Grid item xs={2} sm={3} md={4}/>
        <Grid item xs={8} sm={6} md={4}>
          <Typography variant='body1' style={{color: 'white', textAlign: 'center'}}>
            Change password for user {name} with email {email}
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh'}}>
            <Grid item xs={12} md={10}>
              <TextField
                value={password}
                variant='standard'
                type='password'
                onChange={(e) => {
                  e.preventDefault()
                  setPassword(e.target.value)
                }}
                style={{width: '100%', marginBottom: '2vh'}}
                placeholder="New password"
              />
              <TextField
                value={confirmPassword}
                variant='standard'
                type='password'
                onChange={(e) => {
                  e.preventDefault()
                  setConfirmPassword(e.target.value)
                }}
                style={{width: '100%', marginBottom: '2vh'}}
                placeholder="Confirm password"
              />
            </Grid>
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Grid item xs={12} md={10}>
              <Button variant="outlined" style={{width: '100%', marginTop: '1vh'}} onClick={updatePassword}>Save</Button>
            </Grid>
          </Box>
          <Grid item xs={2} sm={3} md={4}/>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Reset;
