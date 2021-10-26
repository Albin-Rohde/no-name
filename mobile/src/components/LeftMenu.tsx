import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Avatar} from "@mui/material";
import {Logout} from "@mui/icons-material";
import {UserData} from "../clients/ResponseTypes";

interface LeftMenuProps {
  open: boolean;
  setOpen: (open: boolean) => any;
  deleteGame?: () => any;
  user: UserData;
  logout: () => any;
}

export default function LeftMenu(props: LeftMenuProps) {
  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={props.setOpen(false)}
      onKeyDown={props.setOpen(false)}
    >
      {props.user ? (
        <List>
          <ListItem button key='profile'>
            <ListItemIcon>
              <Avatar/>
            </ListItemIcon>
            <ListItemText primary={props.user.username} />
          </ListItem>
          <Divider/>
          <ListItem button key='logout' onClick={props.logout}>
            <ListItemIcon>
              <Logout/>
            </ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItem>
          {props.deleteGame && (
            <ListItem button key='delete-game' onClick={props.deleteGame}>
              <ListItemText primary='Delete Game' />
            </ListItem>
          )}
        </List>
      ): (null)}
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
