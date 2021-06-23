import React, {useEffect, useState} from 'react';
import LogTable from '../components/LogTable';
import axios from 'axios'

export default function Error() {
  const [logs, setLogs] = useState([])
  useEffect(() => {
    console.log('doing fetch!')
    axios({
      withCredentials: true,
      url: `http://localhost:5000/logs/error`,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": process.env.API_BASE_URL,
      },
    }).then(r => {
      const logsWithId = r.data.data.logs.map((log, i) => {
        return {...log, id: i}
      })
      setLogs(logsWithId)
    })
  }, []);

  return (
    <React.Fragment>
      <h2>Error</h2>
      <LogTable logs={logs}/>
    </React.Fragment>
  );
}
