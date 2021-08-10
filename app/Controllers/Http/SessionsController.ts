import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SessionsController {
  public async store(ctx: HttpContextContract) {
    const { email, password } = ctx.request.all()

    const token = ctx.auth.attempt(email, password)

    return token
  }
}
