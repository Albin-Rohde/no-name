import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Button, TextField} from "@mui/material";
import RestClient from "../../clients/RestClient";
import {useEffect, useState} from "react";
import {UserData} from "../../clients/ResponseTypes";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {styled} from "@mui/material/styles";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import {useDispatch} from "react-redux";
import {setError} from "../../redux/redux";

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

interface Props {
  open: boolean;
  deckId: number;
  setOpen: (open: boolean) => void;
  addUser: (user: UserData) => void;
  invited: UserData[];
}

export const FindPlayerModal = (props: Props) =>  {
  const [users, setUsers] = useState<UserData[]>([]);
  const dispatch = useDispatch();
  const rest = new RestClient();
  const isMobile = window.screen.width < 800;

  const searchPlayer = async (e) => {
    try {
      if (!e.target.value) {
        setUsers([]);
        return;
      }
      const res = await rest.makeRequest<UserData[]>({
        method: 'get',
        route: 'user',
        action: '/search',
        query: {username: e.target.value},
      });
      const players = res.filter((p) => !props.invited.some((i) => i.id === p.id))
      setUsers(players);
    } catch (err) {
      if (err.message) {
        dispatch(setError(err.message));
      }
    }
  }

  const sendInvite = async (user: UserData): Promise<void> => {
    try {
      await rest.makeRequest<'ok'>({
        method: 'post',
        route: 'deck',
        action: 'invite',
        data: { cardDeckId: props.deckId, userId: user.id }
      })
      props.addUser(user);
      props.setOpen(false);
    } catch (err) {
      if (err.message) {
        dispatch(setError(err.message));
      }
    }
  }

  const renderUsers = (users: UserData[]) => {
    if (users.length < 1) {
      return;
    }
    return (
        <TableContainer component={Paper} sx={{marginBottom: '4vh'}}>
          <Table aria-label="customized table">
            <TableBody>
              {users.map((user) => (
                <StyledTableRow key={user.id}>
                  <StyledTableCell align={'left'} component="th" scope="row">
                    {user.username}
                  </StyledTableCell>
                  <StyledTableCell align={'right'} component="th" scope="row">
                    <Button color={'success'} variant={'outlined'} onClick={() => sendInvite(user)}>
                      Invite
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )
  }

  useEffect(() => {
    if (props.open === false) {
      setUsers([]);
    }
  }, [props.open])

  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '30vh'}}>
        <Box sx={{
          width: isMobile ? '85vw' : '25vw',
          backgroundColor: '#282c34',
          borderRadius: '10px',
          padding: '15px',
        }}>
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Typography color={'#8795ab'} id="modal-modal-title" variant="h4">
              Search for player
            </Typography>
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2%'}}>
            <TextField
              autoFocus={true}
              InputLabelProps={{
                style: { color: '#8795ab', borderRadius: '5px' },
              }}
              onChange={searchPlayer}
              sx={{backgroundColor: '#282c34', input: { color: '#8795ab' }, borderRadius: '10px'}}
              variant={'outlined'}
              label="Username"
            />
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh', minHeight: '5vh'}}>
            {renderUsers(users)}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
