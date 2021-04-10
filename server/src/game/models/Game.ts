import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import {User} from "../../user/models/User"
import {GameRound} from "./GameRound"
import { getUnusedWhiteCards } from "../../card/services";
import {CardState, PlayerCard} from "../../card/models/PlayerCard";

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


  @OneToOne(type => User)
  @JoinColumn({name: 'host_user_id_fk'})
  gameHost: User

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
      const cardAmount = this.play_cards - user.cards.length
      const whiteCards = await getUnusedWhiteCards(this.key, cardAmount)
      user.cards = await Promise.all(whiteCards.map(wc => {
        const pc = new PlayerCard()
        pc.user = user
        pc.user_id_fk = user.id
        pc.game_key = this.key
        pc.state = CardState.HAND
        pc.white_card = wc
        pc.white_card_id_fk = wc.id
        return pc.save()
      }))
    }
  }
}
