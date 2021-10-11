import React, {useState, useEffect} from "react";
import {Redirect} from 'react-router-dom'

import Register from "./Register";

const Home = () => {
  return (
   <Redirect to={'/register'} />
  )
}

export default Home
