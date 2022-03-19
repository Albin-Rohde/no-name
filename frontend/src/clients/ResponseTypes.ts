export interface GameResponse {
  play_cards: number
  rounds: number
  player_limit: number
  private_lobby: boolean
  card_deck: string
  started: boolean
  key?: string
  joinKey?: string
  users?: UserResponse[]
}

export interface CardDeckResponse {
  id: number,
  name: string,
  cardsCount: number,
  blackCount: number,
  public: boolean,
  owner: number,
  description: string,
}

export interface CardDeckUsersResponse extends CardDeckResponse{
  users: {
    added: UserData[],
    invited: UserData[],
  }
}

export interface GameSocketResponse {
  key: string
  joinKey: string
  gameOptions: GameOptionsResponse
  blackCard?: BlackCardResponse
  currentTurn: number
  active: boolean
  users: UserResponse[]
}

export interface GameOptionsResponse {
  deck: string
  cardLimit: number
  playerLimit: number
  privateLobby: boolean
  rounds: number
}

export interface UserResponse {
  id: number
  username: string
  cards: CardResponse[]
  cardWizz?: boolean
  hasPlayed?: boolean
  isHost?: boolean
  score?: number
}

export enum CardState {
  HAND = 'hand',
  PLAYED_HIDDEN = 'played_hidden',
  PLAYED_SHOW = 'played_show',
  WINNER = 'winner',
}

export interface CardResponse {
  id: number
  text: string
  state: CardState
}

export interface BlackCardResponse {
  id: number
  text: string
  blanks: number
}

export interface UserData {
  id: number
  email?: string
  password?: string
  username: string
  cards?: CardResponse[]
}

export type RestResponse<T> = {
  err: Record<any, any>
  ok: boolean
  data: T
}
