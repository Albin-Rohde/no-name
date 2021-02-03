import { User } from './models/User'
import bcrypt from 'bcrypt'

interface loginRequestBody {
  email: string
  password: string
}
const login = async (body: loginRequestBody) => {
  try {
    if(!body.email || !body.password) {
      throw new Error('BAD_REQUEST')
    }
    const user = await User.findOne({email: body.email})
    if(!user) {
      throw new Error('USER_NOT_FOUND')
    }
    if(user.password !== body.password) {
      throw new Error('AUTH_FAILED')
    }
    return user
  } catch(err) {
    throw new Error(err)
  }
}

interface registerRequestBody {
  email: string
  password: string
  username: string
}

const create = async (body: registerRequestBody) => {
  try {
    const user = new User()
    if(!body.email || !body.password || !body.username) {
      throw new Error('BAD_REQUEST')
    }
    user.password = await bcrypt.hash(body.email, 10)
    user.email = body.email
    user.password = body.password
    user.username = body.username
    await user.save()
    return user
  } catch(err) {
    throw new Error(err)
  }
}


export {login, create}
