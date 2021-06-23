import React, {useEffect, useState} from 'react';
import LogTable from '../components/LogTable';
import axios from 'axios'

export default function Combined() {
  const [logs, setLogs] = useState([])
  useEffect(() => {
    console.log('doing fetch!')
    axios({
      withCredentials: true,
      url: `http://localhost:5000/logs/combined`,
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
      <h2>Combined</h2>
      <LogTable logs={logs}/>
    </React.Fragment>
  );
}
