import {Entity, BaseEntity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column, Index} from "typeorm"
import { User } from "../../user/models/User"

@Entity()
@Index(['game_key', 'round_number'], {unique: true})
export class GameRound extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index('game_key_idx')
  @Column({name: 'game_key_fk', type: 'uuid'})
  game_key: string

  @Column({name: 'round_number'})
  round_number: number

  @ManyToOne(type => User)
  @JoinColumn({name: 'card_wizz_user_id_fk'})
  cardWizz: User

  @Column({name: 'card_wizz_user_id_fk', nullable: true})
  card_wizz_user_id_fk: number
}