import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne, Unique, ManyToMany, OneToOne} from "typeorm"
import { User } from "../../user/models/User"
import { WhiteCard } from "./WhiteCard"


@Entity('black_card')
export class BlackCard extends BaseEntity {
	@PrimaryGeneratedColumn()
  id: number

  @Column({
    default: null
  })
  deck: string

  @Column({name: 'text'})
  text: string
}