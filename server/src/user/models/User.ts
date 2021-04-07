import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Unique,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
  SaveOptions
} from "typeorm"
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
  player_cards: PlayerCard[]

	@Column({nullable: false, name: 'has_played', default: false})
	has_played: boolean

  @CreateDateColumn()
  created_at: string

  @DeleteDateColumn()
  deleted_at: string

  private getGameUser = (user: User): User => {
    const gameUser = user.game.users.find(u => u.id = user.id)
    if(!gameUser) throw new Error('User not on requested game')
    return gameUser
  }

  set played(played: boolean) {
    this.has_played = played
    if(this.game) {
      this.getGameUser(this).has_played = played
    }
  }

  get played(): boolean {
    if(!this.game) {
      return this.has_played
    }
    return this.getGameUser(this).has_played
  }

  set cards(cards: PlayerCard[]) {
    this.player_cards = cards
    if(this.game) {
      this.getGameUser(this).player_cards = cards
    }
  }

  get cards(): PlayerCard[] {
    if(!this.game) {
      return this.player_cards
    }
    return this.getGameUser(this).player_cards
  }

  public syncAndSave = async (opt?: SaveOptions) => {
    if(this.game) {
      this.has_played = this.played
      this.player_cards = this.cards
    }
    return this.save(opt)
  }
}