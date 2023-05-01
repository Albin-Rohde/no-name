import React, {useState} from "react";

import {Box, Card, CardContent, Grid, Paper, Typography} from "@mui/material";
import PlayerDrawer from "../../../components/PlayerDrawer";
import DataTable from "../../../components/DataTable";
import ConfirmPlayModal from "../../../components/ConfirmPlayModal";
import {CardResponse} from "../../../clients/ResponseTypes";
import {SocketClient} from "../../../clients/SocketClient";
import {useSelector} from "react-redux";
import {ReduxState} from "../../../redux/redux";
import * as GameClient from '../../../clients/Game';
import RenderCards from "./components/RenderCards";
import {getFontSize, wrappedCardText} from "../../../utils/utils";

const Game = () => {
  const [confirmPlayOpen, setConfirmPlayOpen] = useState(false);
  const [openCards, setOpenCards] = useState<CardResponse[]>([]);
  const game = useSelector<ReduxState, GameClient.default>((state) => state.game);
  const socket = useSelector<ReduxState, SocketClient>((state) => state.socket);

  const handleCardClick = (card: CardResponse) => {
    if (game.currentUser.hasPlayed) {
      return
    }
    if (openCards.includes(card)) {
      setOpenCards(openCards.filter(c => c.id !== card.id))
      return;
    }
    if (game.blackCard.blanks < 2) {
      setOpenCards([card]);
      setConfirmPlayOpen(true);
      return;
    }
    setOpenCards([...openCards, card]);
    if (game.blackCard.blanks === openCards.length + 1) {
      setConfirmPlayOpen(true);
    }
  }
  const handleFlipClick = (card: CardResponse) => {
    socket.flipCard(card);
  }
  const handleVoteClick = (card: CardResponse) => {
    socket.voteCard(card);
  }
  const handlePlayCard = () => {
    socket.playCard(openCards);
    setOpenCards([]);
    setConfirmPlayOpen(false);
  }
  const closeModal = () => {
    setConfirmPlayOpen(false);
    setOpenCards([]);
  }
  const isMobile = window.screen.width < 800;

  const mainGridHeight = isMobile ? '30vh' : 'calc(94vh - 21vw)'
  return (
    <React.Fragment>
      <Grid container sx={{width: '100%', marginTop: '6vh', height: mainGridHeight}}>
        {!isMobile ?
          <Grid item xs={2} sm={2} md={3} sx={{display: 'flex', justifyContent: 'center'}}>
            <Box sx={{width: '80%', marginTop: '5vh'}}>
              <DataTable/>
              <Paper sx={{
                paddingTop: '15px',
                paddingBottom: '15px',
                backgroundColor: '#282c36',
                marginBottom: '3vh'
              }}>
                <Typography color='white' variant={'body1'} sx={{marginLeft: '2vw'}}>
                  Round {game.currentRound} of {game.gameOptions.rounds}
                </Typography>
              </Paper>
            </Box>
          </Grid> : <Grid item xs={2} sm={2} md={3}/>
        }
        <Grid item xs={8} sm={6} md={6} sx={{display: 'flex', justifyContent: 'center'}}>
          <Card
            sx={{
              minHeight: isMobile ? '29vh' : '12.0vw',
              maxHeight: isMobile ? '30vh' : '12.0vw',
              minWidth: isMobile ? '27vh' : '10.8vw',
              maxWidth: isMobile ? '27vh' : '10.8vw',
            }}
          >
            <CardContent>
              <Typography style={{
                fontSize: getFontSize(game.blackCard.text.length, isMobile, window.screen.height)
              }}>
                {wrappedCardText(game.blackCard.text)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {isMobile && <PlayerDrawer open={false}/>}
      </Grid>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: isMobile ? 'calc(28vh - 125px)' : '3vh',
      }}>
        <RenderCards
          {...{
            game,
            selectedCards: openCards,
            handleCardClick,
            handleFlipClick,
            handleVoteClick,
            handlePlayCard,
          }}
        />
      </Box>
      <Grid item sm={3} md={4}/>
      <ConfirmPlayModal
        open={confirmPlayOpen}
        cards={openCards}
        close={closeModal}
        playCard={handlePlayCard}
      />
    </React.Fragment>
  );
}

export default Game
