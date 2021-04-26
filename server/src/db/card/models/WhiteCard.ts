import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne, Unique, OneToMany} from "typeorm"
import { PlayerCard } from "./PlayerCard"

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

  @OneToMany(type => PlayerCard, card => card.white_card)
  @JoinColumn({name: 'player_cards'})
  player_cards: PlayerCard[]
}