import React, {useState, useContext, useEffect} from "react";

import {Box, Button, Card, Grid, Typography, Paper, TextField, CardContent, Switch} from "@mui/material";
import Spinner from "../../components/Spinner";
import {useHistory} from "react-router-dom";
import PlayerDrawer from "../../components/PlayerDrawer";
import DataTable from "../../components/DataTable";
import ConfirmPlayModal from "../../components/ConfirmPlayModal";
import {CardResponse, UserData} from "../../clients/ResponseTypes";
import {SocketClient} from "../../clients/SocketClient";
import * as GameClient from '../../clients/Game';

interface GameProps {
  game: GameClient.default;
  user: UserData;
  socket: SocketClient;
}

const Game = (props: GameProps) => {
  const [loading, setLoading] = useState(true);
  const [confirmPlayOpen, setConfirmPlayOpen] = useState(false);
  const [openCard, setOpenCard] = useState<CardResponse>(null);

  /*
  const waitForGameActive = async (retryCount: number = 0): Promise<boolean> => {
    if (retryCount > 30) {
      return false;
    }
    if (state.game && state.game.active) {
      return true
    } else {
      await new Promise((r) => setTimeout(r, 200))
      console.log('waited once')
      return waitForGameActive(retryCount + 1);
    }
  }
   */

  if (loading) {
    return (<Spinner/>)
  }

  const handleCardClick = (card: CardResponse) => {
    if (!props.game.currentUser.hasPlayed) {
      setOpenCard(card);
      setConfirmPlayOpen(true);
    }
  }

  const closeModal = () => {
    setConfirmPlayOpen(false);
    setOpenCard(null);
  }

  const handlePlayCard = () => {
    props.socket.playCard(openCard);
    setOpenCard(null);
    setConfirmPlayOpen(false);
  }

  const isMobile = window.screen.width < 800;

  const renderPlaying = () => {
    if (isMobile) {
      return (
        <Box sx={{marginTop: '10vh'}}>
          <Typography color={'white'} variant={'body1'} align={'center'}>
            Your cards
          </Typography>
          <Box sx={{
            display: 'flex',
            overflow: 'scroll',
            marginTop: '2vh',
            scrollSnapType: 'x mandatory',
          }}>
            {renderCards(props.game.cardsOnHand)}
          </Box>
        </Box>
      )
    } else {
      return (
        <Box sx={{marginTop: '20vh'}}>
          <Typography color={'white'} variant={'body1'} align={'center'}>
            Your cards
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh'}}>
            {renderCards(props.game.cardsOnHand)}
          </Box>
        </Box>
      )
    }
  }

  const renderFlipping = () => {
    if (isMobile) {
      return (
        <Box sx={{marginTop: '10vh'}}>
          <Typography color={'white'} variant={'body1'} align={'center'}>
            Played Cards ({props.game.playedCards.length}/{props.game.players.length})
          </Typography>
          <Box sx={{
            display: 'flex',
            overflow: 'scroll',
            marginTop: '2vh',
            scrollSnapType: 'x mandatory',
          }}>
            {renderCards(props.game.playedCards)}
          </Box>
        </Box>
      )
    } else {
      return (
        <Box sx={{marginTop: '20vh'}}>
          <Typography color={'white'} variant={'body1'} align={'center'}>
            {props.game.currentUser.cardWizz && 'You are the Cardwizz'}
            Played Cards ({props.game.playedCards.length}/{props.game.players.length})
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh'}}>
            {renderCards(props.game.playedCards)}
          </Box>
        </Box>
      )
    }
  }

  const renderCards = (cards: CardResponse[]) => {
    return cards.map((card) => {
      return (
        <Card sx={{
          marginRight: isMobile ? '2%' : '5px',
          marginLeft: isMobile ? '2%' : '5px',
          minHeight: '250px',
          maxHeight: '250px',
          minWidth: isMobile ? '200px' : '11.8%',
          maxWidth: isMobile ? '200px' : '11.8%',
          backgroundColor: '#505050',
          scrollSnapAlign: 'center',
        }}
          onClick={() => handleCardClick(card)}
        >
          <CardContent>
            <Typography variant={'h5'}>
              {card.text}
            </Typography>
          </CardContent>
        </Card>
      )
    })
  }

  return (
    <React.Fragment>
      <Grid container sx={{width: '100%', marginTop: '6vh'}}>
        {!isMobile ?
          <Grid item xs={2} sm={2} md={3} sx={{display: 'flex', justifyContent: 'center'}}>
            <Box sx={{width: '80%', marginTop: '5vh'}}>
              <DataTable users={props.game.users}/>
            </Box>
          </Grid> : <Grid item xs={2} sm={2} md={3}/>
        }
        <Grid item xs={8} sm={6} md={6} sx={{display: 'flex', justifyContent: 'center'}}>
          <Card sx={{minHeight: '250px', minWidth: '200px', maxWidth: '200px'}}>
            <CardContent>
              <Typography variant={'h5'}>
                {props.game.blackCard.text}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {isMobile && <PlayerDrawer open={false} users={props.game.users}/>}
      </Grid>
      {props.game.state === 'playing' && !props.game.currentUser.cardWizz && renderPlaying()}
      {['flipping', 'voting'].includes(props.game.state) && renderFlipping()}
      {props.game.currentUser.cardWizz && renderFlipping()}
      <Grid item sm={3} md={4}/>
      <ConfirmPlayModal
        open={confirmPlayOpen}
        card={openCard}
        close={closeModal}
        playCard={handlePlayCard}
      />
    </React.Fragment>
  );
}

export default Game;
