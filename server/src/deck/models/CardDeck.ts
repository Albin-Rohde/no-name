import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import {BlackCard} from "../../card/models/BlackCard";
import {WhiteCard} from "../../card/models/WhiteCard";
import {User} from "../../user/models/User";
import {CardDeckUserRef} from "./CardDeckUserRef";

@Entity('card_deck')
@Unique(['name'])

export class CardDeck extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({name: 'description'})
  description: string

  @OneToMany(type => BlackCard, blackCard => blackCard.deck)
  @JoinColumn()
  blackCards: BlackCard[]

  @OneToMany(type => WhiteCard, whiteCard => whiteCard.deck)
  @JoinColumn()
  whiteCards: WhiteCard[]

  @Column({name: 'public', nullable: false, default: true})
  public: boolean

  @Column({name: 'owner_user_fk', nullable: false})
  _owner_user_fk: number

  @ManyToOne(type => User, user => user.myDecks)
  @JoinColumn({name: 'owner_user_fk', referencedColumnName: 'id'})
  owner: User

  @OneToMany(type => CardDeckUserRef, deckRef => deckRef.deck)
  @JoinColumn()
  userRef: CardDeckUserRef[]
}
