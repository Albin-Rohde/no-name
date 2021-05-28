import axios from 'axios'
import type {RestResponse} from "./ResponseTypes";
// @ts-ignore
import * as process from "process";
import {AuthenticationError, ExpectedError} from "./error";

type Routes = 'game' | 'user' | 'card'
type HttpMethods = 'put' | 'get' | 'post' | 'delete'

interface RestRequestOptions {
  method: HttpMethods
  route: Routes
  data?: Record<any, any>
  action?: string
}

export default class RestClient {
  private readonly baseUrl = `${process.env.API_BASE_URL}${process.env.API_EXTENSION || ''}`
  public async makeRequest<T>(option: RestRequestOptions): Promise<T> {
    option.action = option.action ? `/${option.action}` : ''
    const res: RestResponse<T> = await axios({
      withCredentials: true,
      url: `${this.baseUrl}/${option.route}${option.action}`,
      method: option.method,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": this.baseUrl,
      },
      data: option.data
    }).then(r => r.data)
    if (!res.ok) {
      console.warn(`Request failed with error type: ${res.err?.name}`)
      if(res.err?.name === 'AuthenticationError') {
        throw new AuthenticationError(res.err.message)
      }
    }
    return res.data
  }
}
