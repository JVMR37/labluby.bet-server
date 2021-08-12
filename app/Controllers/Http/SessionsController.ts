import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SessionValidator from 'App/Validators/SessionValidator'
// import Redis from '@ioc:Adonis/Addons/Redis'
export default class SessionsController {
  public async store(ctx: HttpContextContract) {
    await ctx.request.validate(SessionValidator)

    const { email, password } = ctx.request.all()

    try {
      const token = await ctx.auth.attempt(email, password)
      return token
    } catch (err) {
      console.log(err)

      return ctx.response.badRequest('Invalid credentials')
    }
  }
}
