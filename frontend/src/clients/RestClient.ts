import axios from 'axios'
import type {GameResponse} from "./ResponseTypes";
// @ts-ignore
import * as process from "process";

type routes = '/game' | '/user'
type httpMethods = 'put' | 'get' | 'post' | 'delete'

export default class RestClient {
  private readonly baseUrl = `${process.env.API_BASE_URL}${process.env.API_EXTENSION || ''}`
  private readonly route: routes

  constructor(route: routes) {
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
