import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne, Unique, OneToMany} from "typeorm"
import { WhiteCardRef } from "./WhiteCardRef"
import {CardDeck} from "./CardDeck";

export enum WhiteCardType {
  NOUN='noun',
  VERB='verb',
  DEFINITE='definite',
  UNKNOWN='unknown'
}

@Entity('white_card')
@Unique(['deck', 'text'])

export class WhiteCard extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: WhiteCardType,
    default: WhiteCardType.UNKNOWN
  })
  type: WhiteCardType

  @Column({name: 'text'})
  text: string

  @ManyToOne(type => CardDeck, cardDeck => cardDeck.whiteCards)
  @JoinColumn({name: 'deck_fk'})
  deck: CardDeck

  @Column({name: 'deck_fk', nullable: false})
  deck_fk

  @OneToMany(type => WhiteCardRef, card => card.white_card)
  @JoinColumn({name: 'player_cards'})
  player_cards: WhiteCardRef[]
}
