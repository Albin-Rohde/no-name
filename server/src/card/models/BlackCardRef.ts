import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne } from "typeorm"
import {BlackCard} from "./BlackCard";


export enum BlackCardState {
  ACTIVE = 'active',
  USED = 'used',
}

@Entity('black_card_ref')
export class BlackCardRef extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: BlackCardState,
    default: BlackCardState.ACTIVE
  })
  state: BlackCardState

  @Column()
  game_key: string

  @ManyToOne(type => BlackCard)
  @JoinColumn({name: 'black_card_id_fk'})
  blackCard: BlackCard

  @Column()
  black_card_id_fk: number
}
