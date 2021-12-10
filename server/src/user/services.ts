import { User } from './models/User'
import {CreateError} from "../error";
import bcrypt from "bcrypt";

/**
 * Get a user with relevant relations
 * @param userId - User to fetch
 * @param relations - Relations to get for user, if empty gets a default set.
 */
export const getUserWithRelation = async (userId: number, relations: Array<string> | undefined = undefined) => {
  try {
    return User.findOneOrFail(userId, {
      relations: relations ? relations : [
        '_cards',
        '_cards.white_card',
      ]
    })
  } catch(err) {
    throw new Error('User not found')
  }
}

interface CreateUserData {
  email: string
  password: string
  username: string
}

/**
 * Registers a new user to the app
 * Will register a user from the data of the body argument.
 *
 * Returns the newly created user on success
 * @param body
 */
export async function createUser (body: CreateUserData) {
  const existingUser = await User.createQueryBuilder('user')
    .where('user.email = :email', {email: body.email})
    .orWhere('user.username = :username', {username: body.username})
    .getOne()
  if (existingUser) {
    throw new CreateError('A user with same Email or Username already exist')
  }
  const user = new User()
  user.password = await bcrypt.hash(body.password, 10)
  user.email = body.email
  user.username = body.username
  await user.save()
  return user
}

type UpdateUserData = Partial<CreateUserData> & { id: number };

export async function updateUser(input: UpdateUserData) {
  const user = await User.findOneOrFail(input.id);
  if (input.email) {
    user.email = input.email;
  }
  if (input.username) {
    user.username = input.username;
  }
  if (input.password) {
    user.password = await bcrypt.hash(input.password, 10)
  }
  await user.save();
}
