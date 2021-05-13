import type {UserData, UserResponse, CardResponse, RestResponse} from './ResponseTypes'
// @ts-ignore
import * as process from "process";
import autoBind from "auto-bind";
import {HandleError} from "../utils/decorator";
import RestClient from "./RestClient";

interface LoginRequest {
  email: string,
  password: string,
}

export default class UserClient extends RestClient{
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

  @HandleError
  public async login(email: string = this.email, password: string = this.password) {
    this.email = email
    this.password = password
    if(!this.email || !this.password) {
      throw Error('<UserClient.email> and <UserClient.password> need to be set in order to login')
    }
    const userData = await this.makeRequest<UserData>(
      'post',
      'user',
      {email: this.email, password: this.password} as LoginRequest,
      'login',
    )
    this.id = userData.id
    this.email = userData.email
    this.password = userData.password
    this.username = userData.username
    this.isActive = true
  }

  @HandleError
  public async register() {
    const userData = await this.makeRequest<UserData>(
      'post',
      'user',
      {
        email: this.email,
        password: this.password,
        username: this.username
      },
      '',
    )
    if(userData) {
      this.id = userData.id
      this.email = userData.email
      this.password = userData.password
      this.isActive = true
    }
  }

  @HandleError
  public async logout() {
    await this.makeRequest(
      'post',
      'user',
      {},
      'logout',
    )
    this.id = undefined
    this.email = undefined
    this.password = undefined
    this.username = undefined
    this.isActive = false
  }

  @HandleError
  public async getSessionUser() {
    //TODO: make this endpoint more "restfull"
    const userData = await this.makeRequest<UserData>('get', 'user', {}, 'get')
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
