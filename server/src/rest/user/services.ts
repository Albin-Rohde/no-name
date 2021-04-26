import {User} from "../../db/user/models/User";
import bcrypt from "bcrypt";

interface loginRequestBody {
  email: string
  password: string
}

interface registerRequestBody {
  email: string
  password: string
  username: string
}

/**
 * Login a user to the app
 * will look at the password and email of the body argument
 * and compare the password to the hashed password in database.
 *
 * Returns the authenticated user on success
 * @param body
 */
export async function login (body: loginRequestBody) {
  if(!body.email || !body.password) {
    throw new Error('BAD_REQUEST')
  }
  const user = await User.findOne({email: body.email})
  if(!user) {
    throw new Error('USER_NOT_FOUND')
  }
  if(!await bcrypt.compare(body.password, user.password)) {
    throw new Error('AUTH_FAILED')
  }
  return user
}

/**
 * Registers a new user to the app
 * Will register a user from the data of body arument.
 *
 * Returns the newly created user on success
 * @param body
 */
export async function register (body: registerRequestBody) {
  const user = new User()
  if(!body.email || !body.password || !body.username) {
    throw new Error('BAD_REQUEST')
  }
  user.password = await bcrypt.hash(body.password, 10)
  user.email = body.email
  user.username = body.username
  await user.save()
  return user
}
