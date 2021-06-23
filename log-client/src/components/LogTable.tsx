import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import ReactJson from 'react-json-view';

interface Column {
  id: string
  label: string
  minWidth?: number
  maxWidth?: number
  align?: "left" | "center" | "right" | "justify" | "inherit"
  format?: (v: any) => any
}

const columns: Column[] = [
  { id: 'level', label: 'Level', minWidth: 90 },
  { id: 'time', label: 'Timestamp', minWidth: 100 },
  {
    id: 'message',
    label: 'Message',
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

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

let i = 0
function createLog(level, time, message, service, secret: any = {}) {
  if (level === 'error') {
    secret = {name: 'AuthError', stack: 'long stack explaining error', info: 'some more error info'}
  }
  return { id: i++, level, time, message, service, secret };
}

const logs = [
  createLog('info', '2021-06-30T22:04:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:04:03.565Z', 'Server Started to db', 'Server'),
  createLog('error', '2021-06-30T23:04:03.565Z', 'ECONRESET 127.0.0.1:5432', 'Server'),
  createLog('info', '2021-06-30T23:08:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:22:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T22:04:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:04:03.565Z', 'Server Started to db', 'Server'),
  createLog('error', '2021-06-30T23:04:03.565Z', 'ECONRESET 127.0.0.1:5432', 'Server'),
  createLog('info', '2021-06-30T23:08:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:22:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T22:04:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:04:03.565Z', 'Server Started to db', 'Server'),
  createLog('error', '2021-06-30T23:04:03.565Z', 'ECONRESET 127.0.0.1:5432', 'Server'),
  createLog('info', '2021-06-30T23:08:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:22:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T22:04:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:04:03.565Z', 'Server Started to db', 'Server'),
  createLog('error', '2021-06-30T23:04:03.565Z', 'ECONRESET 127.0.0.1:5432', 'Server'),
  createLog('info', '2021-06-30T23:08:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:22:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T22:04:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:04:03.565Z', 'Server Started to db', 'Server'),
  createLog('error', '2021-06-30T23:04:03.565Z', 'ECONRESET 127.0.0.1:5432', 'Server'),
  createLog('info', '2021-06-30T23:08:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:22:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T22:04:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:04:03.565Z', 'Server Started to db', 'Server'),
  createLog('error', '2021-06-30T23:04:03.565Z', 'ECONRESET 127.0.0.1:5432', 'Server'),
  createLog('info', '2021-06-30T23:08:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:22:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T22:04:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:04:03.565Z', 'Server Started to db', 'Server'),
  createLog('error', '2021-06-30T23:04:03.565Z', 'ECONRESET 127.0.0.1:5432', 'Server'),
  createLog('info', '2021-06-30T23:08:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:22:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T22:04:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:04:03.565Z', 'Server Started to db', 'Server'),
  createLog('error', '2021-06-30T23:04:03.565Z', 'ECONRESET 127.0.0.1:5432', 'Server'),
  createLog('info', '2021-06-30T23:08:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:22:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T22:04:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:04:03.565Z', 'Server Started to db', 'Server'),
  createLog('error', '2021-06-30T23:04:03.565Z', 'ECONRESET 127.0.0.1:5432', 'Server'),
  createLog('info', '2021-06-30T23:08:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:22:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T22:04:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:04:03.565Z', 'Server Started to db', 'Server'),
  createLog('error', '2021-06-30T23:04:03.565Z', 'ECONRESET 127.0.0.1:5432', 'Server'),
  createLog('info', '2021-06-30T23:08:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:22:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T22:04:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:04:03.565Z', 'Server Started to db', 'Server'),
  createLog('error', '2021-06-30T23:04:03.565Z', 'ECONRESET 127.0.0.1:5432', 'Server'),
  createLog('info', '2021-06-30T23:08:03.565Z', 'Server connected to db', 'Server'),
  createLog('info', '2021-06-30T23:22:03.565Z', 'Server connected to db', 'Server'),
]

const useStyles = makeStyles({
  root: {
    width: '100%',
    marginTop: '15vh',
  },
  container: {
    maxHeight: 440,
  },
  err: {
    color: 'rgb(255,44,33)',
    fontWeight: 600
  },
  info: {

  },
  selected: {
    backgroundColor: 'rgb(80,80,80)'
  }
});

export default function LogTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [detailedLog, setDetailLog] = React.useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <React.Fragment>
      <Paper className={classes.root} elevation={5}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.level}
                    onClick={() => setDetailLog(row.id)}
                    className={row.id === detailedLog ? classes.selected : ''}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      console.log(value)
                      return (
                        <TableCell key={column.id} align={column.align} className={row.level === 'error' ? classes.err : classes.info}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={logs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <Paper variant="outlined">
        {detailedLog !== null ? <ReactJson
          src={logs[detailedLog]}
          theme="monokai"
          displayDataTypes={false}
          enableClipboard={false}
          iconStyle={'circle'}
          displayObjectSize={false}
        /> : ''}
      </Paper>
    </React.Fragment>
  );
}
