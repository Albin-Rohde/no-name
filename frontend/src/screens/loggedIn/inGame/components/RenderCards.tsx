import Game, {GameState} from "../../../../clients/Game";
import {BlackCardResponse, CardResponse} from "../../../../clients/ResponseTypes";
import React from "react";
import {Box, Typography} from "@mui/material";
import CardsList from "./CardsList";

type CardClickCallback = (card: CardResponse) => void;

interface RenderCardsProps {
  game: Game;
  handleCardClick: CardClickCallback,
  handleFlipClick: CardClickCallback,
  handleVoteClick: CardClickCallback,
}

interface CardsProps {
  cards: CardResponse[];
  blackCard: BlackCardResponse;
  cardClickCb: (card: CardResponse) => any;
  helpText: string;
}

const RenderCards = (props: RenderCardsProps) => {
  function getCardsState(): CardsProps {
    if (props.game.state === GameState.DISPLAY_WINNER) {
      return {
        cards: [props.game.winnerCard],
        cardClickCb: (_c) => null,
        helpText: `${props.game.winningPlayer.username} bet all of you with their magic combo`,
        blackCard: props.game.blackCard,
      }
    }
    const playedStatus = `${props.game.playedCards.length}/${props.game.players.length}`
    const cardProps: Partial<CardsProps> = { blackCard: props.game.blackCard };
    if (props.game.currentUser.cardWizz) {
      cardProps.cards = props.game.playedCards;
      switch (props.game.state) {
        case GameState.PLAYING:
          cardProps.helpText = `You are the cardwizz. Wait for everyone to play ${playedStatus}`;
          cardProps.cardClickCb = props.handleFlipClick;
          break;
        case GameState.FLIPPING:
          cardProps.helpText = `You are the cardwizz. Flip the cards`;
          cardProps.cardClickCb = props.handleFlipClick;
          break;
        case GameState.VOTING:
          cardProps.helpText = `You are the cardwizz. Pick a winner!`;
          cardProps.cardClickCb = props.handleVoteClick;
          break;
        default:
          cardProps.helpText = `You are the cardwizz. Wait for everyone to play ${playedStatus}`;
          cardProps.cardClickCb = props.handleFlipClick;
      }
    } else {
      switch (props.game.state) {
        case GameState.PLAYING:
          if (props.game.currentUser.hasPlayed) {
            cardProps.helpText = `Wait for everyone to play ${playedStatus}`;
            cardProps.cards = props.game.playedCards;
            cardProps.cardClickCb = props.handleFlipClick;
            break;
          }
          cardProps.helpText = `Pick a funny card`;
          cardProps.cards = props.game.cardsOnHand;
          cardProps.cardClickCb = props.handleCardClick;
          break;
        case GameState.FLIPPING:
          cardProps.helpText = `Wait for the cardwizz to flip all cards`;
          cardProps.cards = props.game.playedCards;
          cardProps.cardClickCb = props.handleFlipClick;
          break;
        case GameState.VOTING:
          cardProps.helpText = `Wait for the cardwizz to pick winner`;
          cardProps.cards = props.game.playedCards;
          cardProps.cardClickCb = props.handleVoteClick;
          break;
        default:
          cardProps.helpText = `Your cards`;
          cardProps.cardClickCb = props.handleCardClick;
          cardProps.cards = props.game.cardsOnHand;
      }
    }
    return cardProps as CardsProps;
  }
  const state = getCardsState();
  const isMobile = window.screen.width < 800;
  if (isMobile) {
    return (
      <Box>
        <Typography color={'white'} variant={'body1'} align={'center'}>
          {state.helpText}
        </Typography>
        <Box sx={{
          display: 'flex',
          overflow: 'scroll',
          marginTop: '2vh',
          scrollSnapType: 'x mandatory',
        }}>
          <CardsList cards={state.cards} lastFlipped={props.game.lastFlipped} blackCard={state.blackCard} cardClickCb={state.cardClickCb}/>
        </Box>
      </Box>
    )
  } else {
    return (
      <Box>
        <Typography color={'white'} variant={'h5'} align={'center'}>
          {state.helpText}
        </Typography>
        <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh'}}>
          <CardsList cards={state.cards} lastFlipped={props.game.lastFlipped} blackCard={state.blackCard} cardClickCb={state.cardClickCb}/>
        </Box>
      </Box>
    )
  }
}

export default RenderCards
