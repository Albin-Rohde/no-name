import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import {User} from "../../user/models/User"
import {GameRound} from "./GameRound"
import {getUnusedBlackCard, getUnusedWhiteCards} from "../../card/services";
import {CardState, WhiteCardRef} from "../../card/models/WhiteCardRef";
import {BlackCard} from "../../card/models/BlackCard";

@Entity()

export class Game extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  key: string

  @Column({name: 'play_cards'})
  playCards: number

  @Column()
  rounds: number

  @Column({name: 'card_deck'})
  cardDeck: string

  @Column({name: 'private_lobby'})
  privateLobby: boolean

  @Column({name: 'player_limit'})
  playerLimit: number

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

  @ManyToOne(type => BlackCard)
  @JoinColumn({name: 'black_card_id_fk'})
  blackCard: BlackCard

  @Column({nullable: true})
  black_card_id_fk: number

  /**
   * @private currentUserId
   * Holds the id of what to be considered the currentUser
   * of a game. The currentUser is the user amongst all the game's
   * user's that will be considered the active user in a
   * particular request.
   *
   * Needed
   */
  private currentUserId: number

  /**
   * Returns the User instance for the currentUserId private
   */
  public get currentUser(): User {
    const user = this.users.find(user => user.id === this.currentUserId)
    if(!user) {
      throw new Error('CurrentUser does not exist on game')
    }
    return user
  }

  /**
   * Set the currentUser for the Game instance
   * @param user
   */
  public set currentUser(user: User) {
    this.currentUserId = user.id
  }

  /**
   * Gets all players except the cardWizz
   * @private
   */
  private get allPlayers(): User[] {
    return this.users.filter(user => !user.isCardWizz)
  }

  /**
   * returns a boolean `true` if all players except cardWizz has played
   * since the cardWizz can not play cards.
   * @private
   */
  private get allPlayersHasPlayed(): boolean {
    return this.users
      .filter(user => !user.isCardWizz)
      .every(user => user.hasPlayed)
  }

  /**
   * Add a User to the game
   * @param user
   */
  public addPlayer = (user: User): void => {
    if(this.users.some(u => u.id === user.id)) return
    this.users.push(user)
  }

  /**
   * Removes a user from the game
   * @param user
   */
  public removePlayer = (user: User): void => {
    this.users = this.users.filter((u) => u.id !== user.id)
  }

  /**
   * Assign a cardwizz for each round in the game
   * Makes sure that there is a new cardwizz for every round.
   */
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

  /**
   * Assign new cards to all users in the game.
   * Makes sure to assign that many cards so that
   * each user has as many cards as the card limit
   * allows.
   */
  public handOutCards = async (): Promise<void> => {
    for(const user of this.users) {
      const cardAmount = this.playCards - user.cards.length
      const whiteCards = await getUnusedWhiteCards(this.key, cardAmount)
      user.cards = whiteCards.map(wc => {
        const wcr = new WhiteCardRef()
        wcr.user = user
        wcr.user_id_fk = user.id
        wcr.game_key = this.key
        wcr.state = CardState.HAND
        wcr.white_card = wc
        wcr.white_card_id_fk = wc.id
        return wcr
      })
      await Promise.all(user.cards.map(c => c.save()))
      await user.save()
    }
  }

  /**
   * Retrieves and sets a new black card for the Game
   */
  public newBlackCard = async (): Promise<void> => {
    this.blackCard = await getUnusedBlackCard(this.key)
  }

  /**
   * Flip a card that exists in the game.
   * Implements some additional logic to check that
   * flipping the card is allowed according to game rules.
   * @param cardId - Card to be flipped.
   */
  public flipCard = async (cardId: number): Promise<void> => {
    if(!this.allPlayersHasPlayed) {
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

  /**
   * Vote for a card that exists in the game.
   * Implements some additional logic to check that
   * Voting the card is allowed according to game rules.
   * @param cardId - Card to be voted on.
   */
  public voteCard = async (cardId: number): Promise<void> => {
    if(!this.allPlayersHasPlayed) {
      throw new Error('All users must play before voting')
    }
    const allCards = this.allPlayers.flatMap(user => user.cards)
    if(allCards.some(card => card.state === CardState.PLAYED_HIDDEN)) {
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
