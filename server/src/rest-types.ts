interface RestError {
  name: string
  message: string
  code?: string
}

export type RestResponse<T> = {
  ok: boolean
  err?: RestError
  data: T
}
