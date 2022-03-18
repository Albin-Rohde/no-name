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
import {WhiteCardRef} from "../../card/models/WhiteCardRef";
import {Game} from '../../game/models/Game'
import {NotFoundError} from "../../error";
import {CardDeck} from "../../deck/models/CardDeck";
import {CardDeckUserRef} from "../../deck/models/CardDeckUserRef";

@Entity({name: "player"})
@Unique(["email"])
@Unique(["username"])
@Unique(['id', 'game_fk'])
@Index(['game_fk'])

export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: "email"})
  email: string

  @Column()
  password: string

  @Column({name: "username", length: 20})
  username: string

  @ManyToOne(type => Game, game => game._users, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({name: 'game_fk'})
  game: Game

  @Column({ nullable: true, type: 'uuid'})
  game_fk: string | null

  @OneToMany(type => CardDeck, deck => deck.owner, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'myDecks'})
  myDecks: CardDeck[]

  @OneToMany(type => CardDeckUserRef, cardRef => cardRef.user, {onDelete: 'CASCADE'})
  @JoinColumn()
  deckRef: CardDeckUserRef[]

  @OneToMany(type => WhiteCardRef, card => card.user, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_game_session_key'})
  _cards: WhiteCardRef[]

  @Column({nullable: false, name: 'has_played', default: false})
  hasPlayed: boolean

  @Column({name: 'score', default: 0, nullable: false})
  score: number

  @CreateDateColumn()
  created_at: string

  @DeleteDateColumn()
  deleted_at: string

  public get cards(): WhiteCardRef[] {
    return this._cards.sort((a, b) => a.id - b.id)
  }

  public set cards(cards: WhiteCardRef[]) {
    this._cards = cards
  }

  /**
   * Hybrid property, boolean if the redux is host over a geme
   */
  get isHost(): boolean {
    return this.id === this.game?.hostUserId
  }

  /**
   * Hybrid property, boolean if the redux is cardWizz for the
   * current currentTurn in a game.
   */
  get isCardWizz(): boolean {
    return this.id === this.game?.currentTurn?.card_wizz_user_id_fk
  }

  /**
   * Find card on redux that match supplied cardId
   *
   * Returns a WhiteCardRef on success
   * @param cardId
   */
  public findCard = (cardId: number): WhiteCardRef => {
    const card = this.cards.find(card => card.id === cardId)
    if (!card) {
      throw new NotFoundError(`Could not find <WhiteCardRef> with id ${cardId}`)
    }
    return card
  }
}
