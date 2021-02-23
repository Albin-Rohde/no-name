import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, OneToMany, PrimaryColumn, OneToOne} from "typeorm"
import { User } from "../../user/models/User"

@Entity()
export class GameRound extends BaseEntity {
	@PrimaryColumn()
	game_key_round_number: string

	@OneToOne(type => User)
	@JoinColumn({name: 'user_id_fk'})
	CardWizz: User
}