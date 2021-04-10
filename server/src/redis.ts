import redis, { RedisClient } from 'redis'

class Redis {
  private client: RedisClient

  constructor() {
    this.client = redis.createClient()
  }

  public get = (key: string): Promise<string | null> | void => {
    try {
      return new Promise((resolve, reject) => {
        this.client.get(key, (err, data) => {
          if(err) {
            return reject(err)
          }
          return resolve(data)
        })
      })
    } catch(err) {
      console.error(err)
    }
  }

  public set = (key: string, value: string): Promise<void> | void => {
    try {
      return new Promise((resolve, reject) => {
        this.client.set(key, value, () => {
          resolve()
        })
      })
    } catch(err) {
      console.error(err)
    }
  }
}

export default new Redis();