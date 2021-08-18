import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SessionValidator from 'App/Validators/SessionValidator'
import User from 'App/Models/User'
export default class SessionsController {
  public async store(ctx: HttpContextContract) {
    await ctx.request.validate(SessionValidator)

    const { email, password } = ctx.request.all()

    try {
      const authData = await ctx.auth.attempt(email, password)
      const user = await User.findByOrFail('email', email)

      const userJSON = user.serialize({
        fields: {
          pick: ['id', 'name', 'email', 'is_admin'],
        },
      })

      return ctx.response.ok({
        user: userJSON,
        token: authData.token,
      })
    } catch (err) {
      console.log(err)

      return ctx.response.badRequest({
        error: { message: 'Invalid credentials' },
      })
    }
  }
}
