import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from "react";
import LeftMenu from "./LeftMenu";
import Game from "../clients/Game";
import {UserData} from "../clients/ResponseTypes";
import {useSelector} from "react-redux";
import {ReduxState} from "../redux/redux";

interface MenuProps {
  deleteGame?: () => void;
  user?: UserData;
  logout?: () => Promise<void>;
}
export default function MenuAppBar(props: MenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const game = useSelector<ReduxState, Game | null>((state) => state.game);
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

  const onLogout = () => {
    if (props.logout && props.user) {
      props.logout();
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <LeftMenu
        open={menuOpen}
        setOpen={toggleDrawer}
        logout={onLogout}
        deleteGame={props.deleteGame}
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
            {props.user && (
              <MenuIcon onClick={() => setMenuOpen(!menuOpen)} />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
