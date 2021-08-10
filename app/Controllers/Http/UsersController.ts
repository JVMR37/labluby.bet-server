import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async store(ctx: HttpContextContract) {
    const data = ctx.request.only(['name', 'email', 'password'])
    const user = await User.create(data)

    return user
  }
}
