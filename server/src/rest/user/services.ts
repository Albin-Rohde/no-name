import { User } from "../../db/user/models/User";
import bcrypt from "bcrypt";
import { AuthenticationError, BadRequestError, CreateError } from "../error";

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
    throw new BadRequestError(`'email' and 'password' required on body`)
  }
  const user = await User.findOne({email: body.email})
  if(!user) {
    throw new AuthenticationError(`Could not find <User> with email ${body.email}`)
  }
  if(!await bcrypt.compare(body.password, user.password)) {
    throw new AuthenticationError('Incorrect password')
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
    throw new BadRequestError(`'email', 'password' and 'username' required on body`)
  }
  const existingUser = await User.createQueryBuilder('user')
    .where('user.email = :email', {email: body.email})
    .orWhere('user.username = :username', {username: body.username})
    .getOne()
  if (existingUser) {
    throw new CreateError('A user with same Email or Username already exist')
  }
  user.password = await bcrypt.hash(body.password, 10)
  user.email = body.email
  user.username = body.username
  await user.save()
  return user
}
