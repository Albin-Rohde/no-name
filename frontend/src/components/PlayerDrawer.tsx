import * as React from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import {useEffect} from "react";
import { Paper} from "@mui/material";
import DataTable from "./DataTable";
import {useSelector} from "react-redux";
import {ReduxState} from "../redux/redux";
import Game from "../clients/Game";

const drawerBleeding = 56;

interface Props {
  open: boolean,
}

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: '#282c34'
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

export default function SwipeableEdgeDrawer(props: Props) {
  const [open, setOpen] = React.useState(props.open);
  const game = useSelector<ReduxState, Game>((state) => state.game);

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // This is used only for the example
  return (
    <Root>
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      <SwipeableDrawer
        container={window.document.body}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: 'text.secondary' }}>Game info</Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <Paper sx={{
            paddingTop: '15px',
            paddingBottom: '15px',
            backgroundColor: '#282c36',
            marginBottom: '3vh'
          }}>
            <Typography color='white' variant={'body1'} sx={{marginLeft: '3vw'}}>
              Round {game.currentRound} of {game.gameOptions.rounds}
            </Typography>
          </Paper>
          <DataTable/>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}
