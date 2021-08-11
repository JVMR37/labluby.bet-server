import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async store(ctx: HttpContextContract) {
    await ctx.request.validate(UserValidator)

    const data = ctx.request.only(['name', 'email', 'password'])
    const user = await User.create(data)

    return user
  }
}
