import React, {useState} from "react";

import {Box, Card, CardContent, Grid, Paper, Typography} from "@mui/material";
import PlayerDrawer from "../../../components/PlayerDrawer";
import DataTable from "../../../components/DataTable";
import ConfirmPlayModal from "../../../components/ConfirmPlayModal";
import {CardResponse, CardState} from "../../../clients/ResponseTypes";
import {SocketClient} from "../../../clients/SocketClient";
import {useSelector} from "react-redux";
import {ReduxState} from "../../../redux/redux";
import * as GameClient from '../../../clients/Game';
import {GameState} from "../../../clients/Game";

const Game = () => {
  const [confirmPlayOpen, setConfirmPlayOpen] = useState(false);
  const [openCard, setOpenCard] = useState<CardResponse>(null);
  const game = useSelector<ReduxState, GameClient.default>((state) => state.game);
  const socket = useSelector<ReduxState, SocketClient>((state) => state.socket);
  let cardsRefMap = new Map();

  const handleCardClick = (card: CardResponse) => {
    if (!game.currentUser.hasPlayed) {
      setOpenCard(card);
      setConfirmPlayOpen(true);
    }
  }

  const handleFlipClick = (card: CardResponse) => {
    socket.flipCard(card);
  }

  const handleVoteClick = (card: CardResponse) => {
    socket.voteCard(card);
  }

  const closeModal = () => {
    setConfirmPlayOpen(false);
    setOpenCard(null);
  }

  const handlePlayCard = () => {
    socket.playCard(openCard);
    setOpenCard(null);
    setConfirmPlayOpen(false);
  }

  const isMobile = window.screen.width < 800;

  const renderPlaying = () => {
    if (isMobile) {
      return (
        <Box>
          <Typography color={'white'} variant={'body1'} align={'center'}>
            Your cards
          </Typography>
          <Typography color={'white'} variant={'body1'} align={'center'}>
            Played Cards ({game.playedCards.length}/{game.players.length})
          </Typography>
          <Box sx={{
            display: 'flex',
            overflow: 'scroll',
            marginTop: '2vh',
            scrollSnapType: 'x mandatory',
          }}>
            {renderCards(game.cardsOnHand, handleCardClick)}
          </Box>
        </Box>
      )
    } else {
      return (
        <Box>
          <Typography color={'white'} variant={'body1'} align={'center'}>
            Your cards
          </Typography>
          <Typography color={'white'} variant={'body1'} align={'center'}>
            Played Cards ({game.playedCards.length}/{game.players.length})
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh'}}>
            {renderCards(game.cardsOnHand, handleCardClick)}
          </Box>
        </Box>
      )
    }
  }

  const renderFlipping = () => {
    const cardWizzHelptext = () => {
      if (game.playedCards.length < game.players.length) {
        return 'Wait for everyone to play';
      } else {
        return 'Click the cards to flip them'
      }
    }
    const playerHelpText = () => {
      if (game.playedCards.length < game.players.length) {
        return 'Wait for everyone to play';
      } else {
        return 'Wait for card wizz to flip all cards';
      }
    }
    const renderHelpText = () => {
      if (game.currentUser.cardWizz) {
        return (
          <Typography color={'white'} variant={'body1'} align={'center'}>
            {cardWizzHelptext()}
          </Typography>
        )
      }
      return (
        <Typography color={'white'} variant={'body1'} align={'center'}>
          {playerHelpText()}
        </Typography>
      )
    }
    if (isMobile) {
      return (
        <Box>
          {renderHelpText()}
          <Typography color={'white'} variant={'body1'} align={'center'}>
            Flipped cards ({game.playedCards.filter(c => c.state === CardState.PLAYED_SHOW).length}/{game.players.length})
          </Typography>
          <Box sx={{
            display: 'flex',
            overflow: 'scroll',
            marginTop: '2vh',
            scrollSnapType: 'x mandatory',
          }}>
            {renderCards(game.playedCards, handleFlipClick)}
          </Box>
        </Box>
      )
    } else {
      return (
        <Box>
          {renderHelpText()}
          <Typography color={'white'} variant={'body1'} align={'center'}>
            Flipped cards ({game.playedCards.filter(c => c.state === CardState.PLAYED_SHOW).length}/{game.players.length})
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh'}}>
            {renderCards(game.playedCards, handleFlipClick)}
          </Box>
        </Box>
      )
    }
  }

  const renderVoting = () => {
    const cardWizzHelptext = () => {
      return 'Click on the best card'
    }
    const playerHelpText = () => {
      return 'Wait for card wizz to select winner';
    }
    const renderHelpText = () => {
      if (game.currentUser.cardWizz) {
        return (
          <Typography color={'white'} variant={'body1'} align={'center'}>
            {cardWizzHelptext()}
          </Typography>
        )
      }
      return (
        <Typography color={'white'} variant={'body1'} align={'center'}>
          {playerHelpText()}
        </Typography>
      )
    }
    if (isMobile) {
      return (
        <Box>
          {renderHelpText()}
          <Box sx={{
            display: 'flex',
            overflow: 'scroll',
            marginTop: '2vh',
            scrollSnapType: 'x mandatory',
          }}>
            {renderCards(game.playedCards, handleVoteClick)}
          </Box>
        </Box>
      )
    } else {
      return (
        <Box>
          {renderHelpText()}
          <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh'}}>
            {renderCards(game.playedCards, handleVoteClick)}
          </Box>
        </Box>
      )
    }
  }

  const renderWin = () => {
    if (isMobile) {
      return (
        <Box>
          <Typography color={'white'} variant={'body1'} align={'center'}>
            {game.winningPlayer.username} won this round with the card:
          </Typography>
          <Box sx={{
            display: 'flex',
            overflow: 'scroll',
            marginTop: '2vh',
            scrollSnapType: 'x mandatory',
          }}>
            {renderCards([game.winnerCard], () => null)}
          </Box>
        </Box>
      )
    } else {
      return (
        <Box>
          <Typography color={'white'} variant={'body1'} align={'center'}>
            {game.winningPlayer.username} won this round with the card:
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh'}}>
            {renderCards([game.winnerCard], () => null)}
          </Box>
        </Box>
      )
    }
  }

  const getCardText = (card: CardResponse) => {
    const mergedCardText = () => {
      const blackTextParts = game.blackCard.text.split('_');
      return (<React.Fragment>{blackTextParts[0]}<b>{card.text}</b> {blackTextParts[1]}</React.Fragment>);
    }
    switch (card.state) {
      case CardState.HAND:
        return card.text;
      case CardState.PLAYED_SHOW:
        return mergedCardText();
      case CardState.WINNER:
        return mergedCardText();
      case CardState.PLAYED_HIDDEN:
        return '';
    }
  }

  type CardClickCb = (card: CardResponse) => void;
  const renderCards = (cards: CardResponse[], clickCb: CardClickCb) => {
    return cards.map((card) => {
      return (
        <Card
          sx={{
            marginRight: isMobile ? '2%' : '5px',
            marginLeft: isMobile ? '2%' : '5px',
            minHeight: '250px',
            maxHeight: '250px',
            minWidth: isMobile ? '200px' : '11.8%',
            maxWidth: isMobile ? '200px' : '11.8%',
            backgroundColor: '#505050',
            scrollSnapAlign: 'center',
            cursor: 'pointer',
          }}
          ref={cardsRefMap.get(card.id)}
          className='noSelect' // prevent some default behaviour regarding clickables.
          onClick={() => clickCb(card)}
        >
          <CardContent>
            <Typography variant={'h5'}>
              {getCardText(card)}
            </Typography>
          </CardContent>
        </Card>
      )
    })
  }

  const renderCardsView = () => {
    if (game.currentUser.cardWizz) {
      switch (game.state) {
        case GameState.PLAYING:
          return renderFlipping();
        case GameState.FLIPPING:
          return renderFlipping();
        case GameState.VOTING:
          return renderVoting();
        case GameState.DISPLAY_WINNER:
          return renderWin();
        default:
          return renderFlipping();
      }
    }
    switch (game.state) {
      case GameState.PLAYING:
        if (game.currentUser.hasPlayed) {
          return renderFlipping();
        }
        return renderPlaying();
      case GameState.FLIPPING:
        return renderFlipping();
      case GameState.VOTING:
        return renderVoting();
      case GameState.DISPLAY_WINNER:
        return renderWin();
      default:
        return renderPlaying();
    }
  }

  const mainGridHeight = isMobile ? 'calc(94vh - 430px)' : 'calc(94vh - 400px)'
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
                <Typography color='white' variant={'body1'} sx={{marginLeft: '3vw'}}>
                  Current Card wizz: {game.users.find(u => u.cardWizz).username}
                </Typography>
              </Paper>
            </Box>
          </Grid> : <Grid item xs={2} sm={2} md={3}/>
        }
        <Grid item xs={8} sm={6} md={6} sx={{display: 'flex', justifyContent: 'center'}}>
          <Card
            sx={{
              minHeight: '250px',
              maxHeight: '260px',
              minWidth: '200px',
              maxWidth: '200px',
            }}
          >
            <CardContent>
              <Typography variant={'h5'}>
                {game.blackCard.text}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {isMobile && <PlayerDrawer open={false}/>}
      </Grid>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        {renderCardsView()}
      </Box>
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

export default Game
