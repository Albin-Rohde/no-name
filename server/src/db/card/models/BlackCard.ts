import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {CardDeck} from "./CardDeck";

@Entity('black_card')

@Unique(['text', 'deck'])
export class BlackCard extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: 'text'})
  text: string

  @ManyToOne(type => CardDeck, cardDeck => cardDeck.blackCards)
  @JoinColumn({name: 'deck_fk'})
  deck: CardDeck
}
