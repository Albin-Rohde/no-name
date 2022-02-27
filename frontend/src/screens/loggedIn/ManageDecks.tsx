import {
  Box, Button,
  Chip, Icon,
  Tooltip,
  Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {
  AddCircleOutline,
  DeleteForever,
  EditOutlined,
  InfoOutlined
} from "@mui/icons-material";
import RestClient from "../../clients/RestClient";
import {CardDeckResponse, UserData} from "../../clients/ResponseTypes";
import Divider from "@mui/material/Divider";
import {AddDeckModal} from "../../components/modals/AddDeckModal";
import {EditDeckModal} from "../../components/modals/EdiDeckModal";
import {useDispatch} from "react-redux";
import {setError} from "../../redux/redux";

interface Props {
  setScreen: (screen: 'home' | 'create-game' | 'decks') => void,
  user: UserData,
}
export const ManageDecks = (props: Props) => {
  const [myDecks, setMyDecks] = useState<CardDeckResponse[]>([]);
  const [libraryDecks, setLibraryDecks] = useState<CardDeckResponse[]>([]);
  const [publicDecks, setPublicDecks] = useState<CardDeckResponse[]>([]);
  const [invites, setInvites] = useState<CardDeckResponse[]>([]);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [editDeck, setEditDeck] = useState<CardDeckResponse>(null);
  const dispatch = useDispatch();

  const rest = new RestClient();

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

  const onEditDeck = (deck: CardDeckResponse) => {
    setEditDeck(deck);
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
    const data = await rest.makeRequest<CardDeckResponse[]>({
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
      return (
        <Chip
        onDelete={() => onEditDeck(deck)}
        color={deck.public ? 'success' : 'primary'}
        label={deck.name}
        variant={'outlined'}
        sx={{marginLeft: '1vh'}}
        deleteIcon={<Tooltip title={'edit'}><EditOutlined/></Tooltip>}
        size={'medium'}
        style={{height: '4vh'}}
        />
      )
    })
  }

  const renderLibraryDecks = () => {
    return libraryDecks.map((deck) => {
      if (deck.owner == props.user.id) {
        return (
          <Chip
            color={'primary'}
            label={deck.name}
            variant={'outlined'}
            sx={{marginLeft: '1vh'}}
            size={'medium'}
            style={{height: '4vh'}}
          />
        )
      }
      return (
        <Chip
          color={'primary'}
          label={deck.name}
          variant={'outlined'}
          sx={{marginLeft: '1vh'}}
          size={'medium'}
          onDelete={() => deleteDeckFromLibrary(deck.id)}
          deleteIcon={<DeleteForever/>}
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
  return (
    <React.Fragment>
      <AddDeckModal
        open={addModalOpen}
        setOpen={setAddModalOpen}
        publicDecks={publicDecks}
        invites={invites}
        addDeckToLibrary={addDeckToLibrary}
      />
      <EditDeckModal
        open={!!editDeck}
        setOpen={setEditDeck}
        deck={editDeck}
        user={props.user}
        reFetch={reFetch}
      />
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '4vh'}}>
        <Typography color={'#8795ab'} variant={'h4'}>
          Your Decks <Tooltip title={yourDecksToolTip}><Icon><InfoOutlined/></Icon></Tooltip>
        </Typography>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh'}}>
        <Box sx={{width: '30vw'}}>
          {renderMyDecks()}
          <Button
            disabled
            variant="outlined"
            sx={{minHeight: '4vh', marginLeft: '1vh', borderRadius: '15px'}}
          >
            <AddCircleOutline/>
          </Button>
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
        <Box sx={{width: '30vw'}}>
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
    </React.Fragment>
  )
}