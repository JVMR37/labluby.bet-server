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

  public async show(ctx: HttpContextContract) {
    const user = await User.findByOrFail('id', ctx.params.id)

    return user
  }

  public async update(ctx: HttpContextContract) {
    const user = await User.findByOrFail('id', ctx.params.id)

    const newData = ctx.request.only(['name', 'email'])

    user.merge(newData)

    await user.save()

    return user
  }

  public async destroy(ctx: HttpContextContract) {
    const user = await User.findByOrFail('id', ctx.params.id)

    await user.delete()
  }
}
