import {BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {CardDeck} from "../../deck/models/CardDeck";

@Entity('black_card')

@Index(['deck_fk'])
@Unique(['text', 'deck'])
export class BlackCard extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: 'text', nullable: false})
  text: string

  @Column({name: 'blanks', nullable: false, default: 1})
  blanks: number

  @ManyToOne(type => CardDeck, cardDeck => cardDeck.blackCards)
  @JoinColumn({name: 'deck_fk'})
  deck: CardDeck

  @Column({name: 'deck_fk', nullable: false})
  deck_fk
}
