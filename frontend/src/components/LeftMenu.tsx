import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Avatar, Link} from "@mui/material";
import {Logout} from "@mui/icons-material";
import {UserData} from "../clients/ResponseTypes";
import {useSelector} from "react-redux";
import {ReduxState} from "../redux/redux";
import Game from "../clients/Game";

interface LeftMenuProps {
  open: boolean;
  setOpen: (open: boolean) => any;
  deleteGame?: () => any;
  user?: UserData;
  logout?: () => any;
}

export default function LeftMenu(props: LeftMenuProps) {
  const onLogout = () => {
    if (props.logout) {
      props.logout();
    }
  }
  const game = useSelector<ReduxState, Game | null>((state) => state.game);
  const list = () => (
    <Box
      sx={{ width: 250 }}
      className={'drawer'}
      role="presentation"
      onClick={props.setOpen(false)}
      onKeyDown={props.setOpen(false)}
    >
      {props.user && (
        <List>
          <ListItem button key='profile'>
            <ListItemIcon>
              <Avatar/>
            </ListItemIcon>
            <ListItemText primary={props.user.username} />
          </ListItem>
          <Divider/>
          <ListItem button key='logout' onClick={onLogout}>
            <ListItemIcon>
              <Logout/>
            </ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItem>
          {game && game.currentUser.isHost && props.deleteGame && (
            <ListItem button key='delete-game' onClick={props.deleteGame}>
              <ListItemText primary='Delete Game' />
            </ListItem>
          )}
          {props.user?.admin && (
            <Link href={`${process.env.REACT_APP_API_BASE_URL}/admin`}>
              <ListItem button key='go-to-admin'>
                  <ListItemText primary='Admin' />
              </ListItem>
            </Link>
          )}
        </List>
      )}
    </Box>
  );

  return (
    <div>
      <React.Fragment key='left'>
        <Drawer
          anchor='left'
          open={props.open}
          onClose={props.setOpen(false)}
        >
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
