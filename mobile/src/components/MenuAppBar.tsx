import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from "react";
import LeftMenu from "./LeftMenu";
import Game from "../clients/Game";
import {SocketClient} from "../clients/SocketClient";
import {UserData} from "../clients/ResponseTypes";

interface MenuProps {
  user: UserData;
  game: Game;
  socket: SocketClient;
  logout: () => Promise<void>;
}
export default function MenuAppBar(props: MenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }
        setMenuOpen(open);
      };

  const deleteGameFn = () => {
    if (props.game) {
      if (props.game.currentUser?.isHost) {
        return props.socket.deleteGame;
      }
    }
    return undefined
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <LeftMenu
        open={menuOpen}
        setOpen={toggleDrawer}
        logout={props.logout}
        deleteGame={deleteGameFn()}
        user={props.user}
      />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {props.user ? (
              <MenuIcon onClick={() => setMenuOpen(!menuOpen)} />
            ): (null)}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
