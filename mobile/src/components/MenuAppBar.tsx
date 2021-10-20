import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useContext, useState} from "react";
import {GameHandlerContext} from "../App";
import LeftMenu from "./LeftMenu";

export default function MenuAppBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const state = useContext(GameHandlerContext);
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
  return (
    <Box sx={{ flexGrow: 1 }}>
      <LeftMenu
        open={menuOpen}
        setOpen={toggleDrawer}
        logout={state.logout}
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
            {state.user ? (
              <MenuIcon onClick={() => setMenuOpen(!menuOpen)} />
            ): (null)}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
