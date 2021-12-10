import {createClient, RedisClient} from "redis";

export class Redis {
  private client: RedisClient = null;
  constructor() {
    this.client = createClient();
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (ttl) {
        this.client.set(key, value, 'EX', ttl, (err, ok) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        this.client.set(key, value, (err, ok) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        })
      }
    })
  }

  async get(key: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.client.get(key, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data);
        }
      })
    })
  }

  async del(key: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.del(key, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve();
        }
      })
    })
  }
}
