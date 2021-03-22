export interface GameResponse {
  play_cards: number
  rounds: number
  player_limit: number
  private_lobby: boolean
  card_deck: string
	started: boolean
  key?: string
  users?: UserResponse[]
}


export interface GameSocketResponse {
	key: string
	gameOptions: GameOptionsResponse
	started: boolean
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
}

export enum CardState {
	HAND = 'hand',
	PLAYED_HIDDEN = 'played_hidden',
	PLAYED_SHOW = 'played_show',
	USED = 'used'
}

export interface CardResponse {
	id: number
	text: string
	state: CardState
}

export interface UserData {
  id: number
  email?: string
  password?: string
  username: string
	cards?: CardResponse[]
}
