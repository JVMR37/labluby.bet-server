import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SessionValidator from 'App/Validators/SessionValidator'
export default class SessionsController {
  public async store(ctx: HttpContextContract) {
    await ctx.request.validate(SessionValidator)

    const { email, password } = ctx.request.all()

    try {
      const user = await ctx.auth.attempt(email, password)
      return user
    } catch (err) {
      return ctx.response.badRequest('Invalid credentials')
    }
  }
}
