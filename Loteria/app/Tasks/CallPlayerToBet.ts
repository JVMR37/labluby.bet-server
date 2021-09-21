import { BaseTask } from 'adonis5-scheduler/build'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'

import Mail from '@ioc:Adonis/Addons/Mail'
import { DateTime } from 'luxon'

export default class CallPlayerToBet extends BaseTask {
  public static get schedule() {
    return '* * 8 * * *'
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false
  }

  public async handle() {
    console.log('=========================')
    Logger.info('Running CallPlayerToBet task:')
    console.log('=========================')
    console.log(DateTime.now())

    const dateLimit = DateTime.now().minus({ days: 8 })

    const result = await Database.rawQuery(
      'SELECT u.email, u.name from users u where ? > (select created_at from bets where user_id = u.id order by created_at desc limit 1)',
      [dateLimit.toSQL()]
    )

    if (result.rows.length > 0) {
      result.rows.forEach(async (userData: { email: string; name: string }) => {
        await Mail.sendLater((message) => {
          message
            .from('fale-conosco@labluby.bet')
            .to(userData.email)
            .subject('A tua sorte mudou !')
            .htmlView('emails/call_to_bet', {
              name: userData.name,
            })
        })
      })
    }
  }
}
