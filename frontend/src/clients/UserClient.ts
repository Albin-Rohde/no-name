import axios from 'axios'

import type { UserData, UserResponse, CardResponse } from './ResponseTypes'

export default class UserClient {
  private baseUrl = 'http://localhost:5000'
  private route = '/user'
  
  id: number
  email: string
  password: string
  username: string
	cards: CardResponse[] = []
  isActive: boolean = false
  
  constructor(user: UserData | undefined = undefined) {
		if(user) {
			this.id = user.id
			this.username = user.username
			this.cards = user.cards
			this.email = user.email
		}
  }
  
  login = async (email: string = this.email, password: string = this.password) => {
    this.email = email
    this.password = password
    if(!this.email || !this.password) {
      throw Error('<UserClient.email> and <UserClient.password> need to be set in order to login')
    }
    try {
      const userData: UserData = await this.makeRequest(
        `${this.baseUrl}${this.route}/login`,
        'post',
        {email: this.email, password: this.password}
      )
      this.id = userData.id
      this.email = userData.email
      this.password = userData.password
      this.username = userData.username
      this.isActive = true
    } catch(error) {
      throw Error('AUTHENTICATION_FAILED')
    }
  }

  register = async () => {
    try {
      const userData: UserData = await this.makeRequest(`${this.baseUrl}${this.route}/register`, 'post', {
        email: this.email,
        password: this.password,
        username: this.username
      })
      if(userData) {
        this.id = userData.id
        this.email = userData.email
        this.password = userData.password
        this.isActive = true
      }
    } catch(error) {
      throw Error('AUTHENTICATION_FAILED')
    }
  }

  logout = async () => {
    await this.makeRequest(`${this.baseUrl}${this.route}/logout`, 'post', {})
    this.id = undefined
    this.email = undefined
    this.password = undefined
    this.username = undefined
    this.isActive = false
  }

  getSessionUser = async () => {
    const userData: UserData = await this.makeRequest(`${this.baseUrl}${this.route}/get`, 'get')
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

  private makeRequest = async (url: string, method: 'put' | 'get' | 'post' | 'delete', data: object = {}) => {
    try {
      const res: UserData = await axios({
        withCredentials: true,
        url,
        method,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5000",
        },
        data: data
      }).then(r => r.data)
      return res
    } catch(error) {
      throw Error('AUTHENTICATION_FAILED')
    }
  }
}