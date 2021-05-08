import axios from 'axios'
import type {GameResponse} from "./ResponseTypes";

type routes = '/game' | '/user'
type httpMethods = 'put' | 'get' | 'post' | 'delete'

export default class RestClient {
  private readonly baseUrl: string
  private readonly route: routes

  constructor(url: string, route: routes) {
    console.log('constructor: ', url, route)
    this.baseUrl = url
    this.route = route
  }
  makeRequest = async (method: httpMethods, data: object = {}, uri: string = ''): Promise<GameResponse> => {
    try {
      return await axios({
        withCredentials: true,
        url: `${this.baseUrl}${this.route}/${uri}`,
        method,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": this.baseUrl,
        },
        data: data
      }).then(r => r.data)
    } catch(err) {
      console.log(err)
      console.log('Rest request failed')
      console.error(err)
      throw Error(err)
    }
  }
}
