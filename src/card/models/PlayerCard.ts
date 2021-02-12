import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne, Unique} from "typeorm"
import { User } from "../../user/models/User"

@Entity('player_card')

@Unique(['text'])
export class PlayerCard extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    default: null
  })
  deck: string

  @Column({name: 'text'})
  text: string

  @ManyToOne(type => User, user => user.cards, {
    cascade: true,
  })
  @JoinColumn({name: 'user_id_fk'})
  user: User
}