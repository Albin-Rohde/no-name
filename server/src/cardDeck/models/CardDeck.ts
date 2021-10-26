import {BaseEntity, Column, Entity, Index, JoinColumn, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {BlackCard} from "../../card/models/BlackCard";
import {WhiteCard} from "../../card/models/WhiteCard";

@Entity('card_deck')
@Unique(['name'])

export class CardDeck extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
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
}