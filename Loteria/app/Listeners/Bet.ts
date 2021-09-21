import { EventsList } from '@ioc:Adonis/Core/Event'
import User from 'App/Models/User'
const { Kafka } = require('kafkajs')

export default class Bet {
  public async onNewBet(args: EventsList['new:bet']) {
    const broker = 'localhost:9092'
    const kafka = new Kafka({
      clientId: 'labluby-server-001',
      brokers: [broker],
    })
    const producer = kafka.producer()
    const adminsEmails = await User.query().select('email').where('userType', 'ADMIN')
    const messages = [
      {
        value: JSON.stringify({
          ...args,
          adminsEmails: adminsEmails.map((admin) => admin.email),
        }),
      },
    ]

    await producer.connect()
    await producer.send({
      topic: 'new-bet',
      messages,
    })

    await producer.disconnect()
  }
}
