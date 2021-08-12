import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SessionValidator from 'App/Validators/SessionValidator'
// import Redis from '@ioc:Adonis/Addons/Redis'
export default class SessionsController {
  public async store(ctx: HttpContextContract) {
    await ctx.request.validate(SessionValidator)

    // await Redis.set('foo', 'bar')
    // const value = await Redis.get('foo')
    // console.log(value)

    const { email, password } = ctx.request.all()

    try {
      const token = await ctx.auth.use('api').attempt(email, password)
      return token
    } catch (err) {
      console.log(err)

      return ctx.response.badRequest('Invalid credentials')
    }
  }
}
