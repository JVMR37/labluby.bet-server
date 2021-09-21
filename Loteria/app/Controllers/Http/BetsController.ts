import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Bet from 'App/Models/Bet'
import BetValidator from 'App/Validators/BetValidator'
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'
import Event from '@ioc:Adonis/Core/Event'

export default class BetsController {
  /**
   * @swagger
   * /api/hello:
   *   post:
   *     tags:
   *       - Bet
   *     summary: Sample API
   *     parameters:
   *       - name: name
   *         description: Name of the user
   *         in: query
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: Send hello message
   *         example:
   *           message: Hello Guess
   */
  public async store({ request, response, auth }: HttpContextContract) {
    await request.validate(BetValidator)
    try {
      const newBets = request.input('bets') as Array<Object>
      const user = auth.user!

      const trx = await Database.transaction()
      // const user = await User.query({ client: trx }).where('id', userId).firstOrFail()

      let result: Bet[]

      if (newBets) {
        result = await user.related('bets').createMany(
          newBets.map((bet: any) => {
            bet.numbers = bet.numbers.join(' ')
            return bet
          })
        )
      }

      await trx.commit()

      const createdAtDateString = result![0].createdAt.toFormat("MMMM dd, yyyy 'at' HH:mm")

      await Mail.sendLater((message) => {
        message
          .from('fale-conosco@labluby.bet')
          .to(user.email)
          .subject('Nova Aposta Realizada com sucesso !')
          .htmlView('emails/new_bet', {
            name: user.name,
            date: createdAtDateString,
          })
      })

      Event.emit('new:bet', {
        amountOfBets: result!.length,
        userName: user.name,
        createdAtDate: createdAtDateString,
      })

      return response.ok(result!)
    } catch (error) {
      console.log(error)
      return response.badRequest(error)
    }
  }

  /**
   * @swagger
   * /api/hello/:id:
   *   get:
   *     tags:
   *       - Bet
   *     summary: Sample API
   *     parameters:
   *       - name: name
   *         description: Name of the user
   *         in: query
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: Send hello message
   *         example:
   *           message: Hello Guess
   */
  public async show({ response, auth }: HttpContextContract) {
    const userId = auth.user!.id

    const bets = await Bet.query().whereColumn('user_id', userId.toString()).preload('type')

    return response.ok(bets)
  }

  /**
   * @swagger
   * /api/hello/:
   *   get:
   *     tags:
   *       - Bet
   *     summary: Sample API
   *     parameters:
   *       - name: name
   *         description: Name of the user
   *         in: query
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: Send hello message
   *         example:
   *           message: Hello Guess
   */
  public async index({ response, auth, request }: HttpContextContract) {
    const userId = auth.user!.id
    const { page, filter } = request.qs()
    const betsPerPage = 5

    Logger.info('Get Bets: \nPage -> ' + page + '\nFilter -> ' + filter)

    let bets: ModelPaginatorContract<Bet>

    if (filter) {
      const binds = (filter as Array<string>).reduce(
        (acc, _) => (acc === '' ? '?' : acc + ',' + '?'),
        ''
      )

      bets = await Bet.query()
        .where('user_id', userId.toString())
        .whereRaw(`type_id in (${binds})`, filter)
        .orderBy('created_at', 'desc')
        .preload('type')
        .paginate(page, betsPerPage)
    } else {
      bets = await Bet.query()
        .where('user_id', userId.toString())
        .preload('type')
        .orderBy('created_at', 'desc')
        .paginate(page, betsPerPage)
    }

    const responseData = bets.serialize({
      fields: {
        omit: ['type_id', 'updatedAt', 'user_id'],
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

  /**
   * @swagger
   * /api/hello/:id:
   *   patch:
   *     tags:
   *       - Bet
   *     summary: Sample API
   *     parameters:
   *       - name: name
   *         description: Name of the user
   *         in: query
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: Send hello message
   *         example:
   *           message: Hello Guess
   */
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

  /**
   * @swagger
   * /api/hello/:id:
   *   delete:
   *     tags:
   *       - Bet
   *     summary: Sample API
   *     parameters:
   *       - name: name
   *         description: Name of the user
   *         in: query
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: Send hello message
   *         example:
   *           message: Hello Guess
   */
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
