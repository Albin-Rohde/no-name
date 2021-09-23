import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import {User} from "../../user/models/User"
import {GameTurn} from "./GameTurn"
import {NotFoundError} from "../../error";
import {createBlackCardRef, createWhiteCardRef, getUnusedBlackCard, getUnusedWhiteCards} from "../../card/services";
import {CardState, WhiteCardRef} from "../../card/models/WhiteCardRef";
import {CardDeck} from "../../cardDeck/models/CardDeck";
import {BlackCardRef, BlackCardState} from "../../card/models/BlackCardRef";

@Entity()

export class Game extends BaseEntity {
  public nextGameKey: string | null

  @PrimaryGeneratedColumn('uuid')
  key: string

  @Column({name: 'play_cards'})
  playCards: number

  @Column()
  rounds: number

  @ManyToOne(type => CardDeck)
  @JoinColumn({name: 'card_deck_fk'})
  cardDeck: CardDeck

  @Column({name: 'card_deck_fk', nullable: false})
  card_deck_fk: number

  @Column({name: 'private_lobby'})
  privateLobby: boolean

  @Column({name: 'player_limit'})
  playerLimit: number

  @Column({default: false})
  active: boolean

  @Column({default: 1})
  turn_number: number

  @Column({name: 'host_user_id_fk'})
  hostUserId: number

  @OneToMany(type => User, user => user.game, {
    onDelete: "CASCADE",
  })
  @JoinColumn({name: 'user_game_session_key'})
  _users: User[]

  @OneToOne(type => GameTurn)
  @JoinColumn({name: 'current_turn_fk'})
  currentTurn: GameTurn

  @ManyToOne(type => BlackCardRef)
  @JoinColumn({name: 'black_card_id_fk'})
  blackCard: BlackCardRef

  @Column({nullable: true})
  black_card_id_fk: number

  /**
   * Sorted array of all users on the game
   */
  public get users(): User[] {
    return this._users ? this._users.sort((a, b) => a.id - b.id) : []
  }

  /**
   * Set users on the game
   * shortcut to not have to use game._users
   * @param users
   */
  public set users(users: User[]) {
    this._users = users
  }
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
   * Set the currentUser for the Game instance
   * @param user
   */
  public set currentUser(user: User) {
    this.currentUserId = user.id
  }

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
   * Gets all players except the cardWizz
   */
  public get allPlayers(): User[] {
    return this.users.filter(user => !user.isCardWizz)
  }

  /**
   * Gets all cards from all players except cardWizz
   */
  public get allPlayerCards(): WhiteCardRef[] {
    return this.allPlayers.flatMap(user => user.cards)
  }

  /**
   * Game is finished, ture if active false and turn number > 1
   */
  public get isFinished(): boolean {
    return !this.active && this.turn_number > 1
  }

  /**
   * Find card on game that match supplied cardId
   *
   * Returns a WhiteCardRef on success
   * @param cardId
   */
  public findCard = (cardId: number): WhiteCardRef => {
    const card = this.users.flatMap(user => user.cards).find(card => card.id === cardId)
    if (!card) {
      throw new NotFoundError(`Could not find <WhiteCardRef> with id ${cardId}`)
    }
    return card
  }

  /**
   * Find user on game that match supplied userId
   *
   * Returns a User on success
   * @param userId
   */
  public findUser = (userId: number): User => {
    const user = this.users.find(user => user.id === userId)
    if (!user) {
      throw new NotFoundError(`Could not find <User> with id ${userId}`)
    }
    return user
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
  public removePlayer = async (user: User): Promise<void> => {
    this.users = this.users.filter((u) => u.id !== user.id)
    user.game_fk = null
    user.hasPlayed = false
    user.score = 0
    await user.save()
    return
  }

  /**
   * Assign a cardwizz for each currentTurn in the game
   * Makes sure that there is a new cardwizz for every currentTurn.
   */
  public assingCardWizz = async (): Promise<void> => {
    let turns: Promise<GameTurn>[] = []
    let turnNumber = 1
    for (let i = 0; i < this.rounds; i++) {
      turns.push(...this.users.map((u) => {
        const turn = new GameTurn()
        turn.game_key = this.key
        turn.turn_number = turnNumber
        turn.cardWizz = u
        turnNumber++
        return turn.save()
      }))
    }
    const savedTurns = await Promise.all(turns)
    this.currentTurn = savedTurns[0]
  }

  /**
   * Assign new cards to all users in the game.
   * Makes sure to assign that many cards so that
   * each user has as many cards as the card limit
   * allows.
   */
  public handOutCards = async (): Promise<void> => {
    for (const user of this.users) {
      const cardOnHand = user.cards.filter((card) => card.state === CardState.HAND).length
      const cardDelta = this.playCards - cardOnHand
      const whiteCards = await getUnusedWhiteCards(this, cardDelta)
      for (const wc of whiteCards) {
        const wcr = await createWhiteCardRef({
          user,
          whiteCard: wc,
          gameKey: this.key,
          state: CardState.HAND,
        })
        user.cards.push(wcr)
      }
    }
  }

  /**
   * Retrieves and sets a new black card for the Game
   */
  public newBlackCard = async (): Promise<void> => {
    if (this.blackCard) {
      this.blackCard.state = BlackCardState.USED
      await this.blackCard.save()
    }
    const blackCard = await getUnusedBlackCard(this)
    this.blackCard = await createBlackCardRef({
      blackCard,
      gameKey: this.key
    })
  }
}
