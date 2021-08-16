import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Bet from 'App/Models/Bet'
import Type from 'App/Models/Type'
import User from 'App/Models/User'
import BetValidator from 'App/Validators/BetValidator'

export default class BetsController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(BetValidator)
    try {
      //TODO: Testar para verificar se a criação é feita corretamente com o relacionamento na hora da busca

      const newBets = request.input('bets') as Array<Object>
      const userId = request.input('user_id')

      const trx = await Database.transaction()
      const user = await User.query({ client: trx }).where('id', userId).firstOrFail()
      const types = await Type.all()
      let result: Bet | Bet[]
      if (newBets) {
        // result = await Bet.createMany(newBets)
        result = await user.related('bets').createMany(newBets)
        // Bet.$getRelation('type').setRelatedForMany(result, types)
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

  public async show({ response }: HttpContextContract) {
    const bets = await Bet.query().preload('type')

    return response.ok(bets)
  }

  public async index({ response }: HttpContextContract) {
    const bets = await Bet.find(1)
    const result = await bets!.related('type').query()

    return response.ok(result)
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
