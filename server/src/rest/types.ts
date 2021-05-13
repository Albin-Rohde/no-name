export type RestResponse<T> = {
  ok: boolean
  err: Error
  data: T
}
