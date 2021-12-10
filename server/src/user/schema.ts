import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().email('Not a valid email').required(),
  password: yup.string().required(),
})
export interface LoginInput extends yup.Asserts<typeof loginSchema> {}

export const createSchema = yup.object({
  email: yup.string().email('Not a valid email').required(),
  password: yup.string().required(),
  username: yup.string().required(),
})
export interface CreateInput extends yup.Asserts<typeof createSchema> {}

export const emailSchema = yup.object({
  email: yup.string().required(),
})
export interface EmailInput extends yup.Asserts<typeof emailSchema> {}

export const updateSchema = yup.object({
  id: yup.number().required(),
  email: yup.string().email('Not a valid email'),
  password: yup.string(),
  username: yup.string(),
}).test(
  'Assert one of must exist',
  'new email, password or username must be supplied',
  (obj) => [obj.email, obj.username, obj.password].some(v => !!v)
)
export interface UpdateInput extends yup.Asserts<typeof updateSchema> {}
