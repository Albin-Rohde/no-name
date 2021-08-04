import React, {useEffect, useState} from 'react';
import LogTable from '../components/LogTable';
import axios from 'axios'

export default function Combined() {
  const [logs, setLogs] = useState([])
  useEffect(() => {
    axios({
      withCredentials: true,
      url: `http://app.${document.domain}/api/logs/combined`,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
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
