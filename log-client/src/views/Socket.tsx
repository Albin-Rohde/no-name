import React, {useEffect, useState} from 'react';
import LogTable, {Column} from "../components/LogTable";
import axios from "axios";

export default function Socket() {
  const [logs, setLogs] = useState([])
  useEffect(() => {
    console.log('doing fetch!')
    axios({
      withCredentials: true,
      url: `http://app.localhost/api/logs/socket`,
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
  const columns: Column[] = [
    { id: 'level', label: 'Level', minWidth: 90 },
    { id: 'timestamp', label: 'Timestamp', minWidth: 100 },
    {
      id: 'eventName',
      label: 'Event',
      minWidth: 170,
      align: 'left',
    },
    {
      id: 'service',
      label: 'Service',
      minWidth: 100,
      align: 'left',
    },
  ];
  return (
    <React.Fragment>
      <h2>Socket</h2>
      <LogTable logs={logs} columns={columns}/>
    </React.Fragment>
  );
}
