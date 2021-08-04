import React, {useEffect, useState} from 'react';
import LogTable from '../components/LogTable';
import axios from 'axios'

export default function Error() {
  const [logs, setLogs] = useState([])
  useEffect(() => {
    console.log('doing fetch!')
    axios({
      withCredentials: true,
      url: `http://app.${document.domain}/api/logs/error`,
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
      <h2>Error</h2>
      <LogTable logs={logs}/>
    </React.Fragment>
  );
}
