import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm"
import {CardState, PlayerCard} from "../../card/models/PlayerCard";
import {Game} from '../../game/models/Game'

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

  @Column({nullable: false, name: 'has_played', default: false})
  hasPlayed: boolean

  @CreateDateColumn()
  created_at: string

  @DeleteDateColumn()
  deleted_at: string

  public playCard = (cardId: number): void => {
    const card = this.cards.find(card => card.id === cardId)
    if(!card) {
      throw new Error('Card not found on user')
    }
    card.state = CardState.PLAYED_HIDDEN
    this.hasPlayed = true
  }

  get isHost(): boolean {
    return this.id === this.game?.hostUserId
  }

  get isCardWizz(): boolean {
    return this.id === this.game?.round?.card_wizz_user_id_fk
  }
}
