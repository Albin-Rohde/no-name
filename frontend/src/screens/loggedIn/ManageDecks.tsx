import {
  Box,
  Button,
  Chip,
  Icon,
  Tooltip,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {
  AddCircleOutline, Clear,
  DeleteForever,
  InfoOutlined
} from "@mui/icons-material";
import RestClient from "../../clients/RestClient";
import {CardDeckResponse, CardDeckUsersResponse, UserData} from "../../clients/ResponseTypes";
import Divider from "@mui/material/Divider";
import {AddDeckModal} from "../../components/modals/AddDeckModal";
import {useDispatch} from "react-redux";
import {setError} from "../../redux/redux";
import {DeckCard} from "../../components/DeckCard";

interface Props {
  setScreen: (screen: 'home' | 'create-game' | 'decks') => void,
  user: UserData,
}
export const ManageDecks = (props: Props) => {
  const [myDecks, setMyDecks] = useState<CardDeckUsersResponse[]>([]);
  const [libraryDecks, setLibraryDecks] = useState<CardDeckResponse[]>([]);
  const [publicDecks, setPublicDecks] = useState<CardDeckResponse[]>([]);
  const [invites, setInvites] = useState<CardDeckResponse[]>([]);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const rest = new RestClient();

  const isMobile = window.screen.width < 800;

  const addDeckToLibrary = async (deckId: number) => {
    try {
      const addedDeck = await rest.makeRequest<CardDeckResponse>({
        method: 'post',
        route: 'deck',
        action: 'library/add',
        data: {cardDeckId: deckId}
      });
      setLibraryDecks([...libraryDecks, addedDeck])
      setPublicDecks(publicDecks.filter((deck) => deck.id !== addedDeck.id));
      fetchInvites();
    } catch (err) {
      if (err.message) {
        dispatch(setError(err.message));
      }
    }
  }

  const deleteDeckFromLibrary = async (deckId: number) => {
    try {
      const deletedDeck = await rest.makeRequest<CardDeckResponse>({
        method: 'post',
        route: 'deck',
        action: 'library/remove',
        data: {cardDeckId: deckId},
      });
      setLibraryDecks(libraryDecks.filter((deck) => deck.id !== deletedDeck.id));
      fetchPublicDecks();
      fetchInvites();
    } catch (err) {
      if (err.message) {
        dispatch(setError(err.message));
      }
    }
  }

  const fetchMyDecks = async () => {
    const data = await rest.makeRequest<CardDeckUsersResponse[]>({
      method: 'get',
      route: 'deck',
      action: 'created',
    })
    setMyDecks(data)
  }

  const fetchLibraryDecks = async () => {
    const data = await rest.makeRequest<CardDeckResponse[]>({
      method: 'get',
      route: 'deck',
      action: 'library'
    });
    setLibraryDecks(data)
  }

  const fetchPublicDecks = async () => {
    const publicDecks = await rest.makeRequest<CardDeckResponse[]>({
      method: 'get',
      route: 'deck',
      action: 'public'
    });
    setPublicDecks(publicDecks);
  }

  const fetchInvites = async () => {
    const invites = await rest.makeRequest<CardDeckResponse[]>({
      method: 'get',
      route: 'deck',
      action: 'invite',
    })
    setInvites(invites);
  }

  const renderMyDecks = () => {
    return myDecks.map((deck) => {
      return <DeckCard
        id={deck.id}
        title={deck.name}
        description={deck.description}
        public={deck.public}
        cardsCount={deck.cardsCount}
        blackCount={deck.blackCount}
        addedUsers={deck.users.added}
        invitedUsers={deck.users.invited}
        currentUser={props.user}
      />
    })
  }

  const renderLibraryDecks = () => {
    return libraryDecks
      .filter((deck) => deck.owner !== props.user.id)
      .map((deck) => {
        return (
          <Chip
            color={'primary'}
            label={deck.name}
            variant={'outlined'}
            sx={{marginLeft: '1vh'}}
            size={'medium'}
            onDelete={() => deleteDeckFromLibrary(deck.id)}
            deleteIcon={<Clear/>}
            style={{height: '4vh'}}
          />
        )
    })
  }
  const reFetch = async (): Promise<void> => {
    try {
      await fetchMyDecks();
      await fetchLibraryDecks();
      await fetchPublicDecks();
      await fetchInvites();
    } catch (err) {
      if (err.message) {
        dispatch(setError(err.message))
      }
    }
  }

  useEffect(() => {
    reFetch();
  }, [])

  const yourDecksToolTip: string = 'There are the decks that you have created, you may edit these.'
  const libraryToolTip: string = 'These are the decks you have added to your library.'
  const myDecksStyle = {
    width: isMobile ? '100vw' : '60vw',
    display: 'flex',
    justifyContent: isMobile ? 'left' : 'center',
    overflow: isMobile ? 'scroll' : 'none',
  }
  return (
    <React.Fragment>
      <AddDeckModal
        open={addModalOpen}
        setOpen={setAddModalOpen}
        publicDecks={publicDecks}
        invites={invites}
        addDeckToLibrary={addDeckToLibrary}
      />
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '4vh'}}>
        <Typography color={'#8795ab'} variant={'h4'}>
          Your Decks <Tooltip title={yourDecksToolTip}><Icon><InfoOutlined/></Icon></Tooltip>
        </Typography>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh'}}>
        <Box sx={myDecksStyle}>
          {renderMyDecks()}
        </Box>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <Divider sx={{marginTop: '5vh', width: '90vw'}}/>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '5vh'}}>
        <Typography color={'#8795ab'} variant={'h4'}>
          Your library <Tooltip title={libraryToolTip}><Icon><InfoOutlined/></Icon></Tooltip>
        </Typography>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh'}}>
        <Box sx={{maxWidth: isMobile ? '80vw' : '30vw'}}>
          {renderLibraryDecks()}
          <Button
            onClick={() => setAddModalOpen(true)}
            variant="outlined"
            sx={{minHeight: '4vh', marginLeft: '1vh', borderRadius: '15px'}}
          >
            <AddCircleOutline/>
          </Button>
        </Box>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '15vh'}}>
        <Button color='error' variant={'outlined'} onClick={() => props.setScreen('home')}>Back</Button>
      </Box>
    </React.Fragment>
  )
}