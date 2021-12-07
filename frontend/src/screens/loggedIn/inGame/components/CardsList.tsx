import {Card, CardContent, Typography} from "@mui/material";
import React, {useEffect} from "react";
import {BlackCardResponse, CardResponse, CardState} from '../../../../clients/ResponseTypes';

interface CardsListProps {
  cards: CardResponse[];
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
  minHeight: '250px',
  maxHeight: '250px',
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
  const isMobile = window.screen.width < 800;

  useEffect(() => {
    if (!props.lastFlipped) {
      return;
    }
    const cardRef = document.getElementById(props.lastFlipped.id.toString());
    cardRef.scrollIntoView({behavior: 'smooth', block: 'center'});
  }, [props.lastFlipped])
  const getCardText = (card: CardResponse) => {
    const mergedCardText = () => {
      const blackTextParts = props.blackCard.text.split('_');
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

  const cards = props.cards.map((card) => {
    const cardStyle = isMobile ? CARD_STYLE_MOBILE : CARD_STYLE_DESKTOP;
    return (
      <Card
        id={card.id.toString()}
        sx={cardStyle}
        className='noSelect playedCards' // prevent some default behaviour regarding clickables.
        onClick={() => props.cardClickCb(card)}
      >
        <CardContent>
          <Typography variant={'h5'}>
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
