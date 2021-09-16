import supertest from 'supertest'
import test from 'japa'
import url from '../base_url'
import User from 'App/Models/User'
import Type from 'App/Models/Type'
import Bet from 'App/Models/Bet'

test.group('Bet tests', (group) => {
  let AUTH_TOKEN: string

  group.before(async () => {
    await User.create({
      name: 'User Bet Teste',
      email: 'user_bet_teste@teste.com',
      password: '123456',
    })

    await Type.firstOrCreate({
      type: 'Mega-Sena',
      description:
        'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
      range: 60,
      price: 4.5,
      maxNumber: 6,
      color: '#01AC66',
      minCartValue: 30,
    })

    const response = await supertest(url)
      .post('/sessions')
      .send({ email: 'user_bet_teste@teste.com', password: '123456' })

    AUTH_TOKEN = response.body.token
  })

  test('Creating a mega sena bet with random numbers', async () => {
    const megaSena = await Type.findBy('type', 'Mega-Sena')
    const numbers: Array<number> = []

    while (numbers.length < megaSena!.maxNumber) {
      const possibleNumber = Math.ceil(Math.random() * megaSena!.range)

      if (!numbers.some((selectedNumber) => possibleNumber === selectedNumber)) {
        numbers.push(possibleNumber)
      }
    }

    const newBet = {
      numbers,
      price: megaSena!.price,
      typeId: megaSena!.id,
    }

    await supertest(url)
      .post('/bets')
      .set('Authorization', 'bearer ' + AUTH_TOKEN)
      .send({ bets: [newBet] })
      .expect(200)
  })

  group.after(async () => {
    await Bet.query().delete()
    await Type.query().delete()
  })
})
