import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useSelector} from "react-redux";
import {ReduxState} from "../redux/redux";
import Game from "../clients/Game";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#2f333d',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#38404f',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#2f333d',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function DataTable() {
  const game = useSelector<ReduxState, Game>((state) => state.game);
  return (
    <TableContainer component={Paper} sx={{marginBottom: '4vh'}}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align={'left'}>Players</StyledTableCell>
            <StyledTableCell align={'left'}>Score</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {game.users.map((user) => (
            <StyledTableRow key={user.id}>
              <StyledTableCell align={'left'} component="th" scope="row">
                {user.username}
              </StyledTableCell>
              <StyledTableCell align={'left'} component="th" scope="row">
                {user.score}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

//<StyledTableCell align="right">{row.protein}</StyledTableCell>
