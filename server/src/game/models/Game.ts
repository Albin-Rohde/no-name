import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../../user/models/User"
import { GameRound } from "./GameRound"
import { getUniqueCards } from "../../card/services";
import { CardState } from "../../card/models/PlayerCard";

@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  key: string

  @Column()
  play_cards: number

  @Column()
  rounds: number

  @Column()
  card_deck: string

  @Column()
  private_lobby: boolean

  @Column()
  player_limit: number

  @Column({default: false})
  started: boolean

  @Column({default: 1})
  current_round: number

  @OneToMany(type => User, user => user.game, {
    onDelete: "CASCADE",
  })

  @JoinColumn({name: 'user_game_session_key'})
  users: User[]

  private currentUserId: number

  get currentUser(): User {
    const user = this.users.find(user => user.id === this.currentUserId)
    if(!user) {
      throw new Error('CurrentUser does not exist on game')
    }
    return user
  }

  set currentUser(user: User) {
    this.currentUserId = user.id
  }

  public addPlayer = (user: User): void => {
    if(this.users.some(u => u.id === user.id)) return
    this.users.push(user)
  }

  public createRounds = async (): Promise<void> => {
    if(this.users.length === 0) throw new Error('No users on game')
    let userIdx = 0
    for(let r = 0; r < this.rounds; r++) {
      if(userIdx > this.users.length - 1) userIdx = 0
      const round = new GameRound()
      round.game_key = this.key
      round.round_number = r + 1
      round.cardWizz = this.users[userIdx]
      await round.save()
      userIdx++
    }
  }

  public handOutCards = async (): Promise<void> => {
    for(const user of this.users) {
      const cards = await getUniqueCards(
        this.play_cards - user.cards.length,
        this.key,
        user
      )
      user.cards = await Promise.all(cards.map((card) => {
        card.state = CardState.HAND
        card.game_key = this.key
        card.user = user
        card.user_id_fk = user.id
        return card.save()
      }))
    }
  }
}
