import {Box, Button, Card, Chip, Icon, Switch, TextField, Tooltip, Typography} from "@mui/material";
import {CardDeckResponse, UserData} from "../clients/ResponseTypes";
import {AddCircleOutline, Clear, EditOutlined} from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import React, {useState} from "react";
import {FindPlayerModal} from "./modals/FindPlayerModal";
import RestClient from "../clients/RestClient";
import {useDispatch} from "react-redux";
import {setError} from "../redux/redux";

const CARD_STYLE = {
  backgroundColor: '#3d3d3d',
}

const CARD_STYLE_MOBILE = {
  ...CARD_STYLE,
  minHeight: '240px',
  marginRight: '5%',
  marginLeft: '5%',
  minWidth: '60vw',
  scrollSnapAlign: 'center',
}

const CARD_STYLE_DESKTOP = {
  ...CARD_STYLE,
  minHeight: '300px',
  marginRight: '14px',
  marginLeft: '14px',
  width: '375px',
  borderRadius: '0.3vw',
}

const WHITE_CARD_ICON = {
  width: '10px',
  height: '16px',
  backgroundColor: '#d7d7d7',
  borderRadius: '1px',
  color: 'black',
  marginRight: '1%',
}

const BLACK_CARD_ICON = {
  width: '10px',
  height: '16px',
  backgroundColor: '#232323',
  borderRadius: '1px',
  color: 'white',
  marginRight: '1%',
}

interface EditProps {
  cb?: () => any
}
const EditIcon = (props: EditProps) => {
  return (
    <Icon sx={{cursor: 'pointer'}}>
      <EditOutlined sx={{maxHeight: '16px', marginTop: '6px'}}/>
    </Icon>
  )
}

interface UpdateDeckData {
  id: number
  description?: string,
  public?: boolean,
  name?: string,
}

interface Props {
  id: number;
  title: string;
  description: string;
  public: boolean;
  cardsCount: number;
  blackCount: number;
  invitedUsers: UserData[];
  addedUsers: UserData[];
  currentUser: UserData;
}
export const DeckCard = (props: Props) => {
  const [addPlayerModalOpen, setAddPlayerModalOpen] = useState<boolean>(false);
  const [invitedUser, setInvitedUsers] = useState<UserData[]>(props.invitedUsers);
  const [users, setUsers] = useState<UserData[]>(props.addedUsers);
  const [isPublic, setIsPublic] = useState<boolean>(props.public);
  const [title, setTitle] = useState<string>(props.title);
  const [description, setDescription] = useState<string>(props.description);
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [editDescription, setEditDescription] = useState<boolean>(false);

  const isMobile = window.screen.width < 800;
  const dispatch = useDispatch();
  const rest = new RestClient();

  const addUser = (user: UserData): void => {
    setInvitedUsers([...invitedUser, user]);
  }

  const removeUser = async (cardDeckId, userId) => {
    try {
      setUsers(users.filter((u) => u.id !== userId));
      setInvitedUsers(invitedUser.filter((u) => u.id !== userId));
      await rest.makeRequest<void>({
        method: 'post',
        route: 'deck',
        action: 'invite/remove',
        data: {
          cardDeckId,
          userId,
        },
      })
    } catch (err) {
      if (err.message) {
        dispatch(setError(err.message));
      }
    }
  }

  const updateDeck = async (data: UpdateDeckData): Promise<void> => {
    try {
      await rest.makeRequest<CardDeckResponse>({
          method: 'post',
          route: 'deck',
          action: `update/${data.id}`,
          data: data,
        });
    } catch (err) {
      if (err.message) {
        dispatch(setError(err.message))
      }
    }
  }

  const togglePublic = async (_e, val: boolean): Promise<void> => {
    setIsPublic(val);
    await updateDeck({id: props.id, public: val})
  }

  const handleUpdateTitle = async (): Promise<void> => {
    setEditTitle(false);
    if (title === props.title) {
      return;
    }
    await updateDeck({id: props.id, name: title});
  }

  const handleUpdateDesc = async (): Promise<void> => {
    setEditDescription(false);
    if (description === props.description) {
      return;
    }
    await updateDeck({id: props.id, description});
  }

  const renderUsersChip = () => {
    const userChips = users.filter((user) => user.id !== props.currentUser.id)
      .map((user) => {
        return (
          <Tooltip title={'Player has added this deck to their library'}>
            <Chip
              color={'primary'}
              label={user.username}
              variant={'outlined'}
              sx={{marginLeft: '1vh'}}
              size={'medium'}
              onDelete={() => removeUser(props.id, user.id)}
              deleteIcon={<Clear/>}
              style={{height: '3vh'}}
            />
          </Tooltip>
        )
      })
    const invitedUserChips = invitedUser.map((user) => {
      return (
        <Tooltip title={'Invite is pending accept'}>
          <Chip
            color={'warning'}
            label={user.username}
            variant={'outlined'}
            sx={{marginLeft: '1vh'}}
            size={'medium'}
            style={{height: '3vh'}}
            onDelete={() => removeUser(props.id, user.id)}
            deleteIcon={<Clear/>}
          />
        </Tooltip>
      )
    })
    return [...userChips, ...invitedUserChips]
  }

  return (
    <React.Fragment>
      <FindPlayerModal
        open={addPlayerModalOpen}
        setOpen={setAddPlayerModalOpen}
        addUser={addUser}
        deckId={props.id}
        invited={[...users, ...invitedUser]}
      />
      <Card sx={isMobile ? CARD_STYLE_MOBILE : CARD_STYLE_DESKTOP}>
        {editTitle && (
          <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '5%'}}>
            <TextField
              variant={'standard'}
              autoFocus
              onBlur={handleUpdateTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{width: '50%'}}
            />
          </Box>
        )}
        {!editTitle && (
          <Typography onClick={() => setEditTitle(true)} variant={'h5'} sx={{marginTop: '5%', textAlign: 'center'}}>
            {title} <EditIcon/>
          </Typography>
        )}
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          {editDescription && (
            <TextField
              variant={'standard'}
              autoFocus
              onBlur={handleUpdateDesc}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateDesc()}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{width: '90%', marginTop: '1%', fontSize: '0.9em'}}
            />
          )}
          {!editDescription && (
            <Typography onClick={() => setEditDescription(true)} fontSize={'0.9em'} variant={'body1'} sx={{textAlign: 'center', marginTop: '1%', maxWidth: '80%'}}>
              {props.description} <EditIcon/>
            </Typography>
          )}
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: '5%', marginBottom: '3%'}}>
          <Divider style={{width: '92%'}}/>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Typography variant={'h6'} sx={{textAlign: 'center', marginTop: '1%', maxWidth: '80%'}}>
            Players
          </Typography>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Box sx={{width: '95%', marginTop: '1vh'}}>
            {renderUsersChip()}
            <Button
              onClick={() => setAddPlayerModalOpen(true)}
              variant="outlined"
              size={'small'}
              sx={{minHeight: '3vh', marginLeft: '1vh', borderRadius: '15px'}}
            >
              <AddCircleOutline/>
            </Button>
          </Box>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: '5%', marginBottom: '3%'}}>
          <Divider style={{width: '92%'}}/>
        </Box>
        <Box sx={{width: '92%', marginLeft: '4%'}}>
          Public <Switch checked={isPublic} onChange={togglePublic}/>
        </Box>
        <Box sx={{width: '92%', marginLeft: '4%', paddingBottom: '0.4%',display: 'flex', flexDirection: 'row'}}>
          <Box sx={WHITE_CARD_ICON}/><Typography fontSize={'0.8em'}>{props.cardsCount}</Typography>
        </Box>
        <Box sx={{width: '92%', marginLeft: '4%', paddingBottom: '5%',display: 'flex', flexDirection: 'row'}}>
          <Box sx={BLACK_CARD_ICON}/><Typography fontSize={'0.8em'}>{props.blackCount}</Typography>
        </Box>
      </Card>
    </React.Fragment>
  )
}