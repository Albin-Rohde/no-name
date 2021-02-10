import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, Unique, BaseEntity, ManyToOne, JoinColumn, OneToMany} from "typeorm"
import { PlayerCard } from "../../card/models/PlayerCard";
import { Game } from '../../game/models/Game'

@Entity({name: "player"})
@Unique(["email"])
@Unique(["username"])

export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: "email"})
  email: string

  @Column()
  password: string

  @Column({name: "username"})
  username: string

  @ManyToOne(type => Game, game => game.users, {
    cascade: true,
  })
  @JoinColumn()
  game: Game

  @OneToMany(type => PlayerCard, card => card.user)
  @JoinColumn({name: 'user_game_session_key'})
  cards: PlayerCard[]

  @CreateDateColumn()
  created_at: string

  @DeleteDateColumn()
  deleted_at: string
}