import React, {useEffect, useState} from 'react';
import LogTable from "../components/LogTable";
import axios from "axios";

export default function Requests() {
  const [logs, setLogs] = useState([])
  useEffect(() => {
    console.log('doing fetch!')
    axios({
      withCredentials: true,
      url: `http://app.localhost/api/logs/requests`,
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
      <h2>Requests</h2>
      <LogTable logs={logs}/>
    </React.Fragment>
  );
}
