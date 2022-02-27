import {CardDeck} from "./models/CardDeck";
import {WhiteCard} from "../card/models/WhiteCard";

const countCardsInDeck = async (deck: CardDeck): Promise<number> => {
  return WhiteCard.createQueryBuilder('wc')
    .leftJoin(CardDeck, 'cd', 'wc.deck_fk = cd.id')
    .where('cd.id = :id', {id: deck.id})
    .getCount();
}

export interface CardDeckData {
  id: number,
  name: string,
  public: boolean,
  description: string,
  cardsCount: number,
}

export const normalizeDeckData = async (decks: CardDeck[]): Promise<CardDeckData[]> => {
  const deckData: Promise<CardDeckData>[] = decks.map<Promise<CardDeckData>>(async (deck): Promise<CardDeckData> => {
    return {
      id: deck.id,
      name: deck.name,
      public: deck.public,
      description: deck.description,
      cardsCount: await countCardsInDeck(deck),
    }
  })
  return await Promise.all(deckData)
}
