import {Box, Button, Card, Chip, Icon, Switch, TextField, Tooltip, Typography} from "@mui/material";
import {CardDeckResponse, UserData} from "../clients/ResponseTypes";
import {AddCircleOutline, Clear, EditOutlined, HighlightOff} from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import React, {useState} from "react";
import {FindPlayerModal} from "./modals/FindPlayerModal";
import RestClient from "../clients/RestClient";
import {useDispatch} from "react-redux";
import {setError} from "../redux/redux";
import {useHistory} from "react-router-dom";

const CARD_STYLE = {
  backgroundColor: '#3d3d3d',
  marginTop: '2vh'
}

const CARD_STYLE_MOBILE = {
  ...CARD_STYLE,
  minHeight: '300px',
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
  const history = useHistory();

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

  const renderUsersChip = () => {
    const userChips = users.filter((user) => user.id !== props.currentUser.id)
      .map((user) => {
        return (
          <Tooltip title={'Player has added this deck to their library'}>
            <Chip
              color={'primary'}
              label={user.username}
              variant={'outlined'}
              sx={{marginLeft: '1vh', height: isMobile ? '4.6vh' : '3vh'}}
              size={'medium'}
              onDelete={() => removeUser(props.id, user.id)}
              deleteIcon={<Clear/>}
            />
          </Tooltip>
        )
      })
    const invitedUserChips = invitedUser.map((user) => {
      return (
        <Tooltip title={'Invite is pending accept'} sx={{minHeight: '3vh'}}>
          <Chip
            color={'warning'}
            label={user.username}
            variant={'outlined'}
            sx={{marginLeft: '1vh', height: '3vh'}}
            size={'medium'}
            onDelete={() => removeUser(props.id, user.id)}
            deleteIcon={<Clear/>}
          />
        </Tooltip>
      )
    })
    return [...userChips, ...invitedUserChips]
  }

  const editCard = () => {
    history.push(`/deck/${props.id}`)
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
        <Typography variant={'h5'} sx={{marginTop: '5%', textAlign: 'center'}}>
          {props.title}
        </Typography>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Typography fontSize={'0.9em'} variant={'body1'} sx={{textAlign: 'center', marginTop: '1%', maxWidth: '80%'}}>
            {props.description}
          </Typography>
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
        <Box sx={{display: 'flex', justifyContent: 'space-between', marginLeft: '10px', marginRight: '10px', marginBottom: '5%'}}>
          <Icon sx={{cursor: 'pointer'}}>
            <Tooltip title={"Edit"}>
              <EditOutlined sx={{maxHeight: '16px', marginTop: '6px'}} onClick={editCard}/>
            </Tooltip>
          </Icon>
          <Icon sx={{cursor: 'pointer'}}>
            <Tooltip title={"Delete"}>
              <HighlightOff sx={{maxHeight: '16px', marginTop: '6px'}} onClick={() => console.log('delete')}/>
            </Tooltip>
          </Icon>
        </Box>
      </Card>
    </React.Fragment>
  )
}