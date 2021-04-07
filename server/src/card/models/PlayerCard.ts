import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne, Unique, ManyToMany, OneToOne} from "typeorm"
import { User } from "../../user/models/User"
import { WhiteCard } from "./WhiteCard"



export enum CardState {
  HAND = 'hand',
  PLAYED_HIDDEN = 'played_hidden',
  PLAYED_SHOW = 'played_show',
  USED = 'used'
}

@Entity('player_card_ref')
export class PlayerCard extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: CardState,
    default: CardState.HAND
  })
  state: CardState

  @Column()
  game_key: string

  @ManyToOne(type => WhiteCard, card => card.player_cards)
  @JoinColumn({name: 'white_card_id_fk'})
  white_card: WhiteCard

  @Column()
  white_card_id_fk: number

  @ManyToOne(type => User, user => user.player_cards, {
    cascade: true,
  })
  @JoinColumn({name: 'user_id_fk'})
  user: User

  @Column({name: 'user_id_fk', nullable: false})
  user_id_fk: number
}