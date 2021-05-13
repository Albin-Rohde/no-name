import axios from 'axios'
import type {RestResponse} from "./ResponseTypes";
// @ts-ignore
import * as process from "process";

type routes = 'game' | 'user'
type httpMethods = 'put' | 'get' | 'post' | 'delete'

export default class RestClient {
  private readonly baseUrl = `${process.env.API_BASE_URL}${process.env.API_EXTENSION || ''}`
  public async makeRequest<T>(
    method: httpMethods,
    route: routes,
    data: object = {},
    action: string = '',
  ): Promise<T> {
    try {
      const res: RestResponse<T> = await axios({
        withCredentials: true,
        url: `${this.baseUrl}/${route}/${action}`,
        method,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": this.baseUrl,
        },
        data: data
      }).then(r => r.data)
      if (!res.ok) {
        throw new Error(`Request failed with error type: ${res.err.name}`)
      }
      return res.data
    } catch(err) {
      console.error(err)
    }
  }
}
