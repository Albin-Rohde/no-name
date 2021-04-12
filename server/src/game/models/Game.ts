import {BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
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

  @Column({name: 'host_user_id_fk'})
  hostUserId: number

  @OneToMany(type => User, user => user.game, {
    onDelete: "CASCADE",
  })
  @JoinColumn({name: 'user_game_session_key'})
  users: User[]

  @OneToOne(type => GameRound)
  @JoinColumn([
    {name: 'key', referencedColumnName: 'game_key'},
    {name: 'current_round', referencedColumnName: 'round_number'},
  ])
  round: GameRound

  private currentUserId: number

  public get currentUser(): User {
    const user = this.users.find(user => user.id === this.currentUserId)
    if(!user) {
      throw new Error('CurrentUser does not exist on game')
    }
    return user
  }

  public set currentUser(user: User) {
    this.currentUserId = user.id
  }

  private get allUsersHasPlayed() {
    return this.users.every(user => user.hasPlayed)
  }

  public addPlayer = (user: User): void => {
    if(this.users.some(u => u.id === user.id)) return
    this.users.push(user)
  }

  public removePlayer = (user: User): void => {
    this.users = this.users.filter((u) => u.id !== user.id)
  }

  public assingCardWizz = async (): Promise<void> => {
    const rounds = await GameRound.find({game_key: this.key})
    let userIdx = 0
    const saveRounds = rounds.map(round => {
      if(userIdx == this.users.length) {
        userIdx = 0
      }
      round.cardWizz = this.users[userIdx]
      round.card_wizz_user_id_fk = this.users[userIdx].id
      userIdx++
      return round.save()
    })
    await Promise.all(saveRounds)
  }

  public handOutCards = async (): Promise<void> => {
    for(const user of this.users) {
      const cardAmount = this.play_cards - user.cards.length
      const whiteCards = await getUnusedWhiteCards(this.key, cardAmount)
      user.cards = whiteCards.map(wc => {
        const pc = new PlayerCard()
        pc.user = user
        pc.user_id_fk = user.id
        pc.game_key = this.key
        pc.state = CardState.HAND
        pc.white_card = wc
        pc.white_card_id_fk = wc.id
        return pc
      })
      await Promise.all(user.cards.map(c => c.save()))
      await user.save()
    }
  }

  public flipCard = async (cardId: number): Promise<void> => {
    if(!this.allUsersHasPlayed) {
      throw new Error('All users must play before flipping')
    }
    const card = this.users.flatMap(user => user.cards).find(card => card.id === cardId)
    if(!card) {
      throw new Error('Card not found on user')
    }
    if(card.state !== CardState.PLAYED_HIDDEN) {
      throw new Error('Can only flip a hidden played card')
    }
    card.state = CardState.PLAYED_SHOW
    await card.save()
  }

  public voteCard = async (cardId: number): Promise<void> => {
    if(!this.allUsersHasPlayed) {
      throw new Error('All users must play before voting')
    }
    const allCards = this.users.flatMap(user => user.cards)
    if(allCards.some(card => card.state === CardState.PLAYED_SHOW)) {
      throw new Error('All cards must be flipped before vote')
    }
    const card = allCards.find(card => card.id ===cardId)
    if(!card) {
      throw new Error('Card not found in game')
    }
    if(card.state !== CardState.PLAYED_SHOW) {
      throw new Error('Can only vote for a shown played card')
    }
    const winningUser = this.users.find(user => user.id === card.user_id_fk)
    if(!winningUser) {
      throw new Error('No user found on winning card')
    }
    winningUser.score++
    card.state = CardState.WINNER
    await card.save()
  }
}
