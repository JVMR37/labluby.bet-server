import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'

import User from 'App/Models/User'
import { DateTime } from 'luxon'
import crypto from 'crypto'
import moment from 'moment'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'

export default class ForgotPasswordController {
  public async store(ctx: HttpContextContract) {
    try {
      await ctx.request.validate(ForgotPasswordValidator)

      const email = ctx.request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.tokenCreatedAt = DateTime.now()

      await user.save()

      await Mail.send((message) => {
        message
          .from('fale-conosco@labluby.bet')
          .to(user.email)
          .subject('Recuperação de Senha')
          .htmlView('emails/forgot_password', {
            email,
            token: user.token,
            link: `${ctx.request.input('redirect_url')}?token=${user.token}`,
          })
      })
    } catch (err) {
      console.log(err)
      return ctx.response.status(err.status).send({ error: { message: 'Deu ruim aí irmão : (' } })
    }
  }

  public async update({ request, response }) {
    try {
      request.validate(ResetPasswordValidator)

      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment().subtract('2', 'days').isAfter(user.tokenCreatedAt)

      if (tokenExpired) {
        return response.status(401).send({ error: { message: 'Token expirado !' } })
      }

      user.token = null
      user.tokenCreatedAt = null
      user.password = password

      await user.save()
    } catch (err) {
      return response.status(err.status).send({
        error: { message: 'Não foi possível resetar sua senha : (' },
      })
    }
  }
}
