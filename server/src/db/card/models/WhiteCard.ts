import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne, Unique, OneToMany} from "typeorm"
import { WhiteCardRef } from "./WhiteCardRef"

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
    default: null
  })
  deck: string

  @Column({
    type: 'enum',
    enum: WhiteCardType,
    default: WhiteCardType.UNKNOWN
  })
  type: WhiteCardType

  @Column({name: 'text'})
  text: string

  @OneToMany(type => WhiteCardRef, card => card.white_card)
  @JoinColumn({name: 'player_cards'})
  player_cards: WhiteCardRef[]
}
