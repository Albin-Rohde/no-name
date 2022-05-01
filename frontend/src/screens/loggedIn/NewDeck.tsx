import React, {useState} from "react";
import {Box, Button, Card, CardContent, Icon, TextareaAutosize, TextField, Tooltip, Typography} from "@mui/material";
import {AddCircleOutline, EditOutlined, HighlightOff} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {setWarning} from "../../redux/redux";
import Divider from "@mui/material/Divider";
import {getFontSize} from "../../utils/utils";
import {v4 as uuid} from 'uuid';

const CARD_STYLE = {
  backgroundColor: '#505050',
  scrollSnapAlign: 'center',
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

interface EditIconProps {
  onClick?: () => any;
}

const EditIcon = (props: EditIconProps) => {
  return (
    <Icon sx={{cursor: 'pointer', float: 'right'}}>
      <EditOutlined sx={{maxHeight: '16px', marginTop: '6px'}} onClick={props?.onClick}/>
    </Icon>
  )
}

interface NewCard {
  id: number;
  text: string;
  open: boolean;
}


interface CardListProps {
  cards: NewCard[];
  cardStyle: Record<string, string | number>;
  updateCards: (c: NewCard[]) => void;
  closeCard: (c: NewCard) => void;
  textBg: string;
  isMobile: boolean;
}

const cardList = (props: CardListProps) => {
  const handleChange = (card: NewCard, text: string): void => {
    card.text = text.replace(/[\r\n]/gm, '');
    props.updateCards([...props.cards])
  }

  const addCard = (): void => {
    props.cards.push({
      id: uuid(),
      text: '',
      open: true,
    })
    props.updateCards([...props.cards])
  }

  const openCard = (card) => {
    card.open = true;
    props.updateCards([...props.cards]);
  }

  const handleKeyDown = (e, card) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      props.closeCard(card)
    }
  }

  const deleteCard = (card: NewCard) => {
    console.log(props.cards)
    const filteredCards = props.cards.filter((c) => c.id !== card.id)
    props.updateCards([...filteredCards]);
  }

  const cards = props.cards.map((card) => {
    return (
        <Card
          sx={{...props.cardStyle, marginTop: '1vh'}}
          key={card.id}
        >
          <Box sx={{display: 'flex', justifyContent: 'center', height: '82%'}}>
            {card.open && (
              <TextareaAutosize
                minRows={8}
                autoFocus
                onBlur={() => props.closeCard(card)}
                placeholder={'Type something funny'}
                onKeyDown={(e) => handleKeyDown(e, card)}
                value={card.text}
                onChange={(e) => handleChange(card, e.target.value)}
                style={{
                  marginTop: '8%',
                  width: '80%',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: props.textBg,
                  boxShadow: 'none',
                  resize: 'none',
                  textAlign: 'left',
                  fontSize: getFontSize(card.text.length, props.isMobile),
                  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                  lineHeight: '1.4em',
                  color: 'white',
                  fontWeight: 400,
                }}
              />
            )}
            {!card.open && (
              <React.Fragment>
                <CardContent>
                  <Typography style={{fontSize: getFontSize(card.text.length, props.isMobile)}}>
                    {card.text}
                  </Typography>
                </CardContent>
              </React.Fragment>
            )}
          </Box>
          {!card.open && (
            <Box sx={{display: 'flex', justifyContent: 'space-between', marginLeft: '10px', marginRight: '5px'}}>
              <Icon sx={{cursor: 'pointer'}}>
                <Tooltip title={"Edit"}>
                  <EditOutlined sx={{maxHeight: '16px', marginTop: '6px'}} onClick={() => openCard(card)}/>
                </Tooltip>
              </Icon>
              <Icon sx={{cursor: 'pointer'}}>
                <Tooltip title={"Delete"}>
                  <HighlightOff sx={{maxHeight: '16px', marginTop: '6px'}} onClick={() => deleteCard(card)}/>
                </Tooltip>
              </Icon>
            </Box>
          )}
        </Card>
    )
  });
  return (
    <React.Fragment>
      {cards}
      {!props.cards.some((card) => card.open) && (
        <Button
          onClick={() => addCard()}
          variant="outlined"
          sx={{
            minWidth: props.cardStyle.minWidth,
            minHeight: props.cardStyle.minHeight,
            marginLeft: props.cardStyle.marginLeft,
            marginTop: '1vh'
          }}
        >
          <AddCircleOutline/>
        </Button>
      )}
    </React.Fragment>
  )
}

export const NewDeck = () => {
  const isMobile = window.screen.width < 800;
  const cardStyle = isMobile ? CARD_STYLE_MOBILE : CARD_STYLE_DESKTOP;
  const [whiteCards, setWhiteCards] = useState<NewCard[]>([]);
  const [blackCards, setBlackCards] = useState<NewCard[]>([]);
  const dispatch = useDispatch();

  const closeWhiteCard = (card: NewCard) => {
    if (card.text.length === 0) {
      dispatch(setWarning('Card should not be empty'))
      return;
    }
    card.open = false;
    setWhiteCards([...whiteCards]);
  }

  const closeBlackCard = (card: NewCard) => {
    if (card.text.length === 0) {
      dispatch(setWarning('Card should not be empty'))
      return;
    }
    const blanks = (card.text.match(/_/g) || []).length
    if (blanks === 0) {
      dispatch(setWarning('Card should have at least one blank (_)'))
      return;
    }
    if (blanks > 2) {
      dispatch(setWarning('A maximum of 2 blanks per card is allowed'))
      return;
    }
    card.open = false;
    setBlackCards([...blackCards]);
  }

  return (
    <React.Fragment>
      <Typography color={'#8795ab'} variant={'h4'} sx={{marginTop: '2vh', textAlign: 'center'}}>
        Create your card deck
      </Typography>
      <Divider sx={{marginTop: '3vh'}}>
        <Typography color={'#8795ab'} variant={'h4'} sx={{textAlign: 'center'}}>
          White Cards ({whiteCards.length})
        </Typography>
      </Divider>
      <Box sx={{display: 'flex', justifyContent: 'center', marginBottom: '2vh'}}>
        <Box sx={{display: 'flex', width: isMobile ? '100%' : '88%', justifyContent: isMobile ? 'center' : 'left', marginTop: '1vh', flexWrap: 'wrap'}}>
          {cardList({
            cards: whiteCards,
            closeCard: closeWhiteCard,
            updateCards: setWhiteCards,
            cardStyle,
            isMobile,
            textBg: '#5b5b5b'
          })}
        </Box>
      </Box>
      <Divider sx={{marginTop: '3vh'}}>
        <Typography color={'#8795ab'} variant={'h4'} sx={{textAlign: 'center'}}>
          Black Cards ({blackCards.length})
        </Typography>
      </Divider>
      <Box sx={{display: 'flex', justifyContent: 'center', marginBottom: '4vh'}}>
        <Box sx={{display: 'flex', width: isMobile ? '100%' : '88%', justifyContent: isMobile ? 'center' : 'left', marginTop: '1vh', flexWrap: 'wrap'}}>
          {cardList({
            cards: blackCards,
            closeCard: closeBlackCard,
            updateCards: setBlackCards,
            cardStyle: {...cardStyle, backgroundColor: '#232323'},
            isMobile,
            textBg: '#2d2d2d',
          })}
        </Box>
      </Box>
      <Divider>
        <Typography color={'#8795ab'} variant={'h4'} sx={{textAlign: 'center'}}>
          Save your deck
        </Typography>
      </Divider>
      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '3vh', marginBottom: '3vh'}}>
          <TextField placeholder={'name'}></TextField>
          <Button color='primary' variant={'outlined'}>Save</Button>
      </Box>
    </React.Fragment>
  )
}