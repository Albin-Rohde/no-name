import axios from 'axios';
// @ts-ignore
import { AuthenticationError } from "./error";
import type { RestResponse } from "./ResponseTypes";
import {config} from "dotenv";
config()

type Routes = 'game' | 'user' | 'card'
type HttpMethods = 'put' | 'get' | 'post' | 'delete'

interface RestRequestOptions {
  method: HttpMethods
  route: Routes
  data?: Record<any, any>
  action?: string
}

export default class RestClient {
  private readonly baseUrl = process.env.REACT_APP_API_BASE_URL || '/api';
  public async makeRequest<T>(option: RestRequestOptions): Promise<T> {
    console.log('baseUrl: ', process.env.REACT_APP_API_BASE_URL)
    try {
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
        if(res.err?.name === 'AuthenticationError') {
          throw new AuthenticationError(res.err.message)
        } else if (res.err.message) {
          throw new Error(res.err.message);
        } else {
          throw new Error('Unknown internal error')
        }
      }
      return res.data
    } catch (err) {
      if (err.message === 'Request failed with status code 500') {
        throw new Error('Unknown internal server error');
      }
      throw err;
    }
  }
}
