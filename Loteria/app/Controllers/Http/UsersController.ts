import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class UsersController {
  public async store(ctx: HttpContextContract) {
    await ctx.request.validate(UserValidator)

    try {
      const data = ctx.request.only(['name', 'email', 'password', 'userType'])
      const user = await User.create(data)

      await Mail.sendLater((message) => {
        message
          .from('fale-conosco@labluby.bet')
          .to(user.email)
          .subject('Seja bem-vindo : )')
          .htmlView('emails/welcome', {
            name: user.name,
          })
      })

      return user
    } catch (error) {
      return ctx.response.badRequest(error)
    }
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
