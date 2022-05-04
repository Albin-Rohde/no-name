import axios from 'axios';
// @ts-ignore
import { AuthenticationError } from "./error";
import type { RestResponse } from "./ResponseTypes";
import {config} from "dotenv";
config()

type Routes = 'game' | 'user' | 'deck' | 'card'
type HttpMethods = 'put' | 'get' | 'post' | 'delete'

interface RestRequestOptions<D> {
  method: HttpMethods;
  route: Routes;
  data?: D | Record<any, any>;
  action?: string;
  query?: Record<string, string>;
}

export default class RestClient {
  private readonly baseUrl = process.env.REACT_APP_API_BASE_URL;
  public async makeRequest<T, D=Record<any, any>>(option: RestRequestOptions<D>): Promise<T> {
    try {
      option.action = option.action ? `/${option.action}` : '';
      const queryString = option.query ? '?' + new URLSearchParams(option.query).toString() : ''
      const res: RestResponse<T> = await axios({
        withCredentials: true,
        url: `${this.baseUrl}/${option.route}${option.action}${queryString}`,
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
        } else if (res.err?.message) {
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
