import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne, Unique, OneToMany} from "typeorm"
import { WhiteCardRef } from "./WhiteCardRef"

@Entity('white_card')

@Unique(['text'])
export class WhiteCard extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    default: null
  })
  deck: string

  @Column({name: 'text'})
  text: string

  @OneToMany(type => WhiteCardRef, card => card.white_card)
  @JoinColumn({name: 'player_cards'})
  player_cards: WhiteCardRef[]
}