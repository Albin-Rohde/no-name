import {Entity, BaseEntity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column, Index} from "typeorm"
import { User } from "../../user/models/User"

@Entity()
@Index(['game_key', 'turn_number'], {unique: true})
export class GameTurn extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index('game_key_idx')
  @Column({name: 'game_key_fk', type: 'uuid'})
  game_key: string

  @Column({name: 'turn_number'})
  turn_number: number

  @ManyToOne(type => User)
  @JoinColumn({name: 'card_wizz_user_id_fk'})
  cardWizz: User

  @Column({name: 'card_wizz_user_id_fk', nullable: true})
  card_wizz_user_id_fk: number
}
