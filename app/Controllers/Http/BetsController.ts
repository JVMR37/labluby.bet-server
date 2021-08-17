import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Bet from 'App/Models/Bet'
import User from 'App/Models/User'
import BetValidator from 'App/Validators/BetValidator'

export default class BetsController {
  public async store({ request, response, auth }: HttpContextContract) {
    await request.validate(BetValidator)
    try {
      const newBets = request.input('bets') as Array<Object>
      const userId = auth.user!.id.toString()

      const trx = await Database.transaction()
      const user = await User.query({ client: trx }).where('id', userId).firstOrFail()

      let result: Bet | Bet[]
      if (newBets) {
        result = await user.related('bets').createMany(newBets)
      } else {
        const newBet = request.all()
        result = await user.related('bets').create(newBet)
      }

      await trx.commit()

      return response.ok(result)
    } catch (error) {
      console.log(error)
      return response.badRequest(error)
    }
  }

  public async show({ response, auth }: HttpContextContract) {
    const userId = auth.user!.id

    const bets = await Bet.query().whereColumn('user_id', userId.toString()).preload('type')

    return response.ok(bets)
  }

  public async index({ response, auth, request }: HttpContextContract) {
    const userId = auth.user!.id
    const { page, filter } = request.qs()
    let bets: ModelPaginatorContract<Bet>

    if (filter) {
      bets = await Bet.query()
        .where('user_id', userId.toString())
        .where('type_id', filter)
        .orderBy('created_at', 'desc')
        .preload('type')
        .paginate(page)
    } else {
      bets = await Bet.query()
        .where('user_id', userId.toString())
        .preload('type')
        .orderBy('created_at', 'desc')
        .paginate(page)
    }

    const responseData = bets.serialize({
      fields: {
        omit: ['type_id', 'updated_at', 'user_id'],
      },
      relations: {
        betType: {
          fields: {
            pick: ['id', 'type', 'color'],
          },
        },
      },
    })

    return response.ok(responseData)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const betId = params.id
    try {
      const bet = await Bet.findByOrFail('id', betId)

      bet.merge(request.all())
      await bet.save()

      return bet
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const betId = params.id
    try {
      const bet = await Bet.findByOrFail('id', betId)

      return await bet.delete()
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
