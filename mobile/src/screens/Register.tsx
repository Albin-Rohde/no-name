import React, {useState} from 'react'
import {Box, Container, Grid, Input, Typography} from "@mui/material";

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return(
    <Container>

      <Grid container marginTop='25vh'>
        <Grid item xs={2} sm={4} md={5}/>
        <Grid item xs={8} sm={4} md={2}>
          <Grid item xs={12}>
            <Input
              value={name}
              onChange={(e) => {
                e.preventDefault()
                setName((e.target.value))
              }}
              style={{width: '100%', marginBottom: '2vh'}}
              placeholder="Enter Name"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              value={email}
              onChange={(e) => {
                e.preventDefault()
                setEmail((e.target.value))
              }}
              style={{width: '100%', marginBottom: '2vh'}}
              placeholder="Enter Email"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              value={password}
              onChange={(e) => {
                e.preventDefault()
                setPassword(e.target.value)
              }}
              style={{width: '100%', marginBottom: '2vh'}}
              placeholder="Enter Password"
            />
          </Grid>
        </Grid>
        <Grid item xs={2} sm={4} md={5}/>
      </Grid>
    </Container>

  )
}

export default Register;
