import autoBind from "auto-bind";
import type { CardResponse, UserData, UserResponse } from './ResponseTypes';
import RestClient from "./RestClient";


export default class User extends RestClient {
  public id: number
  public email: string
  public password: string
  public username: string
  public cards: CardResponse[] = []
  public isActive: boolean = false

  constructor(user: UserData | undefined = undefined) {
    super()
    if(user) {
      this.id = user.id
      this.username = user.username
      this.cards = user.cards
      autoBind(this)
    }
  }

  public async getSessionUser() {
    //TODO: make this endpoint more "restfull"
    const userData = await this.makeRequest<UserData>({method: 'get', route: 'user', action: 'get'})
    this.id = userData.id
    this.email = userData.email
    this.password = userData.password
    this.username = userData.username
    this.isActive = true
  }

  getData = (): UserResponse => {
    return {
      id: this.id,
      username: this.username,
      cards: this.cards,
    }
  }
}
