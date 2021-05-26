import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne, Unique, ManyToMany, OneToOne } from "typeorm"
import { User } from "../../user/models/User"
import { WhiteCard } from "./WhiteCard"


export enum CardState {
  HAND = 'hand',
  PLAYED_HIDDEN = 'played_hidden',
  PLAYED_SHOW = 'played_show',
  WINNER = 'winner',
  USED = 'used',
}

@Entity('white_card_ref')
export class WhiteCardRef extends BaseEntity {
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

  @ManyToOne(type => User, user => user._cards, {
    cascade: true,
  })
  @JoinColumn({name: 'user_id_fk'})
  user: User

  @Column({name: 'user_id_fk', nullable: false})
  user_id_fk: number

  /**
   * Set self to state PLAYED_HIDDEN
   */
  public play = async () => {
    this.state = CardState.PLAYED_HIDDEN
    await this.save()
  }

  /**
   * Set self to state PLAYED_SHOW
   */
  public flip = async () => {
    this.state = CardState.PLAYED_SHOW
    await this.save()
  }

  /**
   * Set self to state WINNER
   */
  public winner = async () => {
    this.state = CardState.WINNER
    await this.save()
  }
}
