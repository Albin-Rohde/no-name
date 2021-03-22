import axios from 'axios'
import type {GameResponse} from "./ResponseTypes"

type routes = '/game' | '/user'
type httpMethods = 'put' | 'get' | 'post' | 'delete'

export default class RestClient {
    private baseUrl = 'http://localhost:5000'
    private route: routes

    constructor(route: routes) {
        this.route = route
    }
    makeRequest = async (method: httpMethods, data: object = {}, uri: string = '') => {
        try {
            const res: GameResponse = await axios({
                withCredentials: true,
                url: `${this.baseUrl}${this.route}/${uri}`,
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": this.baseUrl,
                },
                data: data
            }).then(r => r.data)
            return res
        } catch(err) {
            console.log('Rest request failed')
            console.error(err)
            throw Error(err)
        }
    }
}
