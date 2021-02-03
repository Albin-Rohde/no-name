import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, Unique, BaseEntity, ManyToOne, JoinColumn} from "typeorm"
import { Game } from '../../game/models/Game'

@Entity()
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

  @CreateDateColumn()
  created_at: string

  @DeleteDateColumn()
  deleted_at: string
}