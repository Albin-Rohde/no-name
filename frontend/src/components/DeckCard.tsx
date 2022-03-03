import {Box, Button, Card, Chip, Icon, Switch, Tooltip, Typography} from "@mui/material";
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
  maxHeight: '240px',
  marginRight: '2%',
  marginLeft: '2%',
  minWidth: '200px',
  maxWidth: '200px',
}

const CARD_STYLE_DESKTOP = {
  ...CARD_STYLE,
  minHeight: '300px',
  maxHeight: '13.8vw',
  marginRight: '14px',
  marginLeft: '14px',
  width: '375px',
  borderRadius: '0.3vw',
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

interface Props {
  id: number;
  title: string;
  description: string;
  public: boolean;
  invitedUsers: UserData[];
  addedUsers: UserData[];
  currentUser: UserData;
}
export const DeckCard = (props: Props) => {
  const [addPlayerModalOpen, setAddPlayerModalOpen] = useState<boolean>(false);
  const [invitedUser, setInvitedUsers] = useState<UserData[]>(props.invitedUsers);
  const [users, setUsers] = useState<UserData[]>(props.addedUsers);
  const [isPublic, setIsPublic] = useState<boolean>(props.public);
  const dispatch = useDispatch();
  const rest = new RestClient();

  const addUser = (user: UserData): void => {
    setInvitedUsers([...invitedUser, user]);
  }

  const removeUser = async (cardDeckId, userId) => {
    try {
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

  const togglePublic = async (_e, val: boolean): Promise<void> => {
    setIsPublic(val);
    await rest.makeRequest<CardDeckResponse>({
      method: 'post',
      route: 'deck',
      action: `update/${props.id}`,
      data: {public: val}
    });
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
      />
      <Card sx={CARD_STYLE_DESKTOP}>
        <Typography variant={'h5'} sx={{marginTop: '5%', textAlign: 'center'}}>
          {props.title} <EditIcon/>
        </Typography>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Typography fontSize={'0.9em'} variant={'body1'} sx={{textAlign: 'center', marginTop: '1%', maxWidth: '80%'}}>
            {props.description} <EditIcon/>
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
      </Card>
    </React.Fragment>
  )
}