import axios from 'axios'
import GameClient from './GameClient'
import type userClientType from './UserClient'
import type UserClient from './UserClient'


export default class InGameClient extends GameClient{
  private inGameRoute = '/game-ws'
  constructor(user: UserClient) {
    super(user)
  }
  
}