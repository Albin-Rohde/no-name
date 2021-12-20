import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import RestClient from "../../../clients/RestClient";
import Spinner from "../../../components/Spinner";
import {Redirect} from "react-router-dom";
import {setError} from "../../../redux/redux";

const JoinGame = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [redirect, setRedirect] = useState(null);
  const rest = new RestClient();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const joinKey = window.location.pathname.split('/')[2]
      try {
        await rest.makeRequest({
          method: 'get',
          route: 'game',
          action: `join?key=${joinKey}`
        })
        setLoading(false);
        window.location.replace('/');
      } catch (err) {
        dispatch(setError(err.message))
        setRedirect('/')
        setLoading(false);
      }
    })()
  }, [])

  if (loading) {
    return <Spinner/>
  }
  if (redirect) {
    return <Redirect to={redirect}/>
  }
  return null;
}

export default JoinGame