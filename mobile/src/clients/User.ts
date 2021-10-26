import autoBind from "auto-bind";
import { HandleError } from "../utils/decorator";
import type { CardResponse, UserData, UserResponse } from './ResponseTypes';
import RestClient from "./RestClient";

interface LoginRequest {
  email: string,
  password: string,
}

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

  public async login(email: string = this.email, password: string = this.password) {
    this.email = email
    this.password = password
    if(!this.email || !this.password) {
      throw Error('<user.email> and <user.password> need to be set in order to login')
    }
    const userData = await this.makeRequest<UserData>({
      method: 'post',
      route: 'user',
      data: {email: this.email, password: this.password} as LoginRequest,
      action: 'login',
    })
    this.id = userData.id
    this.email = userData.email
    this.password = userData.password
    this.username = userData.username
    this.isActive = true
    return
  }

  public async register() {
    console.log(this.email);
    const userData = await this.makeRequest<UserData>({
      method: 'post',
      route: 'user',
      data: {
        email: this.email,
        password: this.password,
        username: this.username
      },
      action: 'register',
    })
    if(userData) {
      this.id = userData.id
      this.email = userData.email
      this.password = userData.password
      this.isActive = true
    }
  }

  public async logout() {
    await this.makeRequest({
      method: 'post',
      route: 'user',
      action: 'logout',
    })
    this.id = undefined
    this.email = undefined
    this.password = undefined
    this.username = undefined
    this.isActive = false
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
