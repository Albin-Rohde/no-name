import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('black_card')

@Unique(['text'])
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
