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
	@JoinColumn({name: 'user_id_fk'})
	CardWizz: User

	@Column({name: 'user_id_fk', nullable: false})
	user_id_fk: number
}