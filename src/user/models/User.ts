import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, Unique, BaseEntity, ManyToOne, JoinColumn, OneToMany, Index} from "typeorm"
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

	@Index('username_idx')
  @Column({name: "username"})
  username: string

  @ManyToOne(type => Game, game => game.users, {
    cascade: true,
  })
  @JoinColumn({name: 'game_fk'})
  game: Game

	@Column({ nullable: true })
  game_fk: string | null

  @OneToMany(type => PlayerCard, card => card.user)
  @JoinColumn({name: 'user_game_session_key'})
  cards: PlayerCard[]

  @CreateDateColumn()
  created_at: string

  @DeleteDateColumn()
  deleted_at: string
}