import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, OneToMany, OneToOne} from "typeorm"
import { User } from "../../user/models/User"
import { GameRound } from "./GameRound"

@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  key: string

  @Column()
  play_cards: number

  @Column()
  rounds: number

  @Column()
  card_deck: string

  @Column()
  private_lobby: boolean

  @Column()
  player_limit: number

  @Column({default: false})
  started: boolean

  @Column({default: 1})
  current_round: number

  @OneToMany(type => User, user => user.game, {
    onDelete: "CASCADE",
  })

  @JoinColumn({name: 'user_game_session_key'})
  users: User[]
}