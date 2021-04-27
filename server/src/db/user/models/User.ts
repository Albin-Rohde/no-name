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
import {CardState, WhiteCardRef} from "../../card/models/WhiteCardRef";
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

  @OneToMany(type => WhiteCardRef, card => card.user)
  @JoinColumn({name: 'user_game_session_key'})
  cards: WhiteCardRef[]

  @Column({nullable: false, name: 'has_played', default: false})
  hasPlayed: boolean

  @Column({name: 'score', default: 0, nullable: false})
  score: number

  @CreateDateColumn()
  created_at: string

  @DeleteDateColumn()
  deleted_at: string

  /**
   * Plays a card, Sets the card to played state
   * @param cardId
   */
  public playCard = async (cardId: number): Promise<void> => {
    const card = this.cards.find(card => card.id === cardId)
    if(!card) {
      throw new Error('Card not found on user')
    }
    card.state = CardState.PLAYED_HIDDEN
    this.hasPlayed = true
    await card.save()
  }

  /**
   * Hybrid property, boolean if the user is host over a geme
   */
  get isHost(): boolean {
    return this.id === this.game?.hostUserId
  }

  /**
   * Hybrid property, boolean if the user is cardWizz for the
   * current round in a game.
   */
  get isCardWizz(): boolean {
    return this.id === this.game?.round?.card_wizz_user_id_fk
  }
}
