import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Chip, TextField} from "@mui/material";
import {AddCircleOutline} from "@mui/icons-material";
import {CardDeckResponse} from "../../clients/ResponseTypes";
import Divider from "@mui/material/Divider";



interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  publicDecks: CardDeckResponse[];
  invites: CardDeckResponse[];
  addDeckToLibrary: (deckId) => Promise<void>;
}

export const AddDeckModal = (props: Props) =>  {
  const isMobile = window.screen.width < 800;

  const renderPublicDecks = () => {
    return props.publicDecks.map((deck) => {
      return (
        <Chip
          color={'primary'}
          label={deck.name}
          variant={'outlined'}
          sx={{marginLeft: '1vh'}}
          size={'medium'}
          onDelete={() => props.addDeckToLibrary(deck.id)}
          deleteIcon={<AddCircleOutline/>}
          style={{height: '4vh'}}
        />
      )
    })
  }

  const renderInvites = () => {
    return props.invites.map((deck) => {
      return (
        <Chip
          color={'primary'}
          label={deck.name}
          variant={'outlined'}
          sx={{marginLeft: '1vh'}}
          size={'medium'}
          onDelete={() => props.addDeckToLibrary(deck.id)}
          deleteIcon={<AddCircleOutline/>}
          style={{height: '4vh'}}
        />
      )
    })
  }

  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '30vh'}}>
        <Box sx={{
          width: isMobile ? '85vw' : '40vw',
          backgroundColor: '#282c34',
          borderRadius: '10px',
          padding: '15px',
        }}>
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Typography color={'#8795ab'} id="modal-modal-title" variant="h4">
              Add decks
            </Typography>
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <TextField
              InputLabelProps={{
                style: { color: '#8795ab', borderRadius: '5px' },
              }}
              disabled={true}
              sx={{backgroundColor: '#282c34', input: { color: '#8795ab' }, borderRadius: '10px'}}
              variant={'outlined'}
              label="Search"
            />
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh', minHeight: '5vh'}}>
            {renderPublicDecks()}
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Divider sx={{marginTop: '2vh', width: '75%'}}/>
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh'}}>
            <Typography color={'#8795ab'} id="modal-modal-title" variant="h4">
              Your invites
            </Typography>
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh', minHeight: '5vh'}}>
            {renderInvites()}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
