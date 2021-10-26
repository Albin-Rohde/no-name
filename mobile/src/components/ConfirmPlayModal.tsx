import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {CardResponse} from "../clients/ResponseTypes";
import Spinner from "./Spinner";
import {Button} from "@mui/material";

const style = {
  position: 'absolute' as 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: '#505050',
  boxShadow: 24,
  width: '80vw',
  height: '400px',
  maxWidth: '280px',
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'space-between',
  borderRadius: '4%'
};

interface ConfirmPlayProps {
  open: boolean;
  close: () => void;
  playCard: () => void;
  card: CardResponse;
}

export default function ConfirmPlayModal(props: ConfirmPlayProps) {
  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <React.Fragment>
          <Box sx={style}>
            {props.card ? (
              <Typography variant="h4" sx={{color: 'white', padding: '7%'}}>
                {props.card.text}
              </Typography>
            ) : <Spinner/>}
            <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: '4%'}}>
              <Button
                variant={'outlined'}
                color={'error'}
                sx={{width: '29%', height: '56px', borderWidth: '2px', marginLeft: '4%'}}
                onClick={props.close}
              >
                Back
              </Button>
              <Button
                variant={'outlined'}
                color={'success'}
                sx={{width: '29%', height: '56px', borderWidth: '2px', marginRight: '4%'}}
                onClick={props.playCard}
              >
                Play
              </Button>
            </Box>
          </Box>
        </React.Fragment>
      </Modal>
    </div>
  );
}
