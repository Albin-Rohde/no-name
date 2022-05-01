import {Card, CardContent, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {BlackCardResponse, CardResponse, CardState} from '../../../../clients/ResponseTypes';
import {useDispatch, useSelector} from "react-redux";
import {ReduxState, setError} from "../../../../redux/redux";
import * as GameClient from "../../../../clients/Game";
import {getFontSize} from "../../../../utils/utils";

interface CardsListProps {
  cards: CardResponse[];
  selectedCards: CardResponse[];
  blackCard: BlackCardResponse;
  cardClickCb: (card: CardResponse) => any;
  lastFlipped: CardResponse;
}

const CARD_STYLE = {
  backgroundColor: '#505050',
  scrollSnapAlign: 'center',
  cursor: 'pointer',
}

const CARD_STYLE_MOBILE = {
  ...CARD_STYLE,
  minHeight: '240px',
  maxHeight: '240px',
  marginRight: '2%',
  marginLeft: '2%',
  minWidth: '200px',
  maxWidth: '200px',
}

const CARD_STYLE_DESKTOP = {
  ...CARD_STYLE,
  minHeight: '12.8vw',
  maxHeight: '12.8vw',
  marginRight: '5px',
  marginLeft: '5px',
  minWidth: '11.8vw',
  maxWidth: '11.8vw',
}

const CardsList = (props: CardsListProps) => {
  const game = useSelector<ReduxState, GameClient.default>((state) => state.game);
  const dispatch = useDispatch();
  const isMobile = window.screen.width < 800;

  useEffect(() => {
    if (!props.lastFlipped) {
      return;
    }
    const cardRef = document.getElementById(props.lastFlipped.id.toString());
    cardRef.scrollIntoView({behavior: 'smooth', block: 'center'});
  }, [props.lastFlipped])

  const mergedCardText = (card: CardResponse) => {
    try {
      const blackTextParts = props.blackCard.text.split('_');
      if (props.blackCard.blanks === 1) {
        return (<React.Fragment>{blackTextParts[0]}<b>{card.text}</b> {blackTextParts[1]}</React.Fragment>);
      }
      const secondWhiteCard = game.getSecondPlayedCard(card);
      if (blackTextParts.length < 3) {
        throw new Error('blackCardTextParts where to short to render 2 white cards.')
      }
      return (<React.Fragment>{blackTextParts[0]}<b>{card.text}</b> {blackTextParts[1]} <b>{secondWhiteCard.text}</b> {blackTextParts[2]}</React.Fragment>);
    } catch (err) {
      console.log('Something went wrong combining card texts')
      console.error(err);
      dispatch(setError('Something went wrong.'))
    }
  }

  const getCardText = (card: CardResponse) => {
    switch (card.state) {
      case CardState.HAND:
        return card.text;
      case CardState.PLAYED_SHOW:
        return mergedCardText(card);
      case CardState.WINNER:
        return mergedCardText(card);
      case CardState.PLAYED_HIDDEN:
        return '';
    }
  }

  const getTotalTextLength = (card: CardResponse) => {
    if (card.state === CardState.HAND) {
      return card.text.length
    }
    if (card.state === CardState.PLAYED_HIDDEN) {
      return 0;
    }
    return props.blackCard.text.length + card.text.length
  }

  const cards = props.cards.map((card) => {
    const cardStyle = isMobile ? CARD_STYLE_MOBILE : CARD_STYLE_DESKTOP;
    const selected = props.selectedCards.includes(card);
    return (
      <Card
        id={card.id.toString()}
        sx={{...cardStyle, border: selected ? '2px solid #b0b0b0' : '0px'}}
        className='noSelect playedCards' // prevent some default behaviour regarding clickables.
        onClick={() => props.cardClickCb(card)}
      >
        <CardContent>
          <Typography style={{fontSize: getFontSize(getTotalTextLength(card), isMobile)}}>
            {getCardText(card)}
          </Typography>
        </CardContent>
      </Card>
    )
  })

  return (
    <React.Fragment>
      {cards}
    </React.Fragment>
  )
}

export default CardsList
