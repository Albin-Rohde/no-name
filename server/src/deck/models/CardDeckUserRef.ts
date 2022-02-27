import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/models/User";
import {CardDeck} from "./CardDeck";

@Entity('card_deck_user_ref')

export class CardDeckUserRef extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: 'user_id_fk'})
  user_id_fk: number

  @ManyToOne(type => User, user => user.deckRef)
  @JoinColumn({name: 'user_id_fk', referencedColumnName: 'id'})
  user: User

  @Column({name: 'card_deck_fk'})
  card_deck_fk: number

  @ManyToOne(type => CardDeck, deck => deck.userRef)
  @JoinColumn({name: 'card_deck_fk', referencedColumnName: 'id'})
  deck: CardDeck

  @Column({name: 'invite', nullable: false, default: false})
  invite: boolean
}