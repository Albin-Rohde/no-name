import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, OneToOne, JoinColumn, OneToMany} from "typeorm"
import { User } from "../../user/models/User"

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

  @OneToMany(type => User, user => user.game, {
    onDelete: "CASCADE",
  })
  @JoinColumn({name: 'user_game_session_key'})
  users: User[]
}