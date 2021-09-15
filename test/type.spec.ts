import supertest from 'supertest'
import test from 'japa'
import url from '../base_url'
import User from 'App/Models/User'
import Type from 'App/Models/Type'

test.group('Types tests', (group) => {
  let AUTH_TOKEN: string

  group.before(async () => {
    await User.create({
      name: 'User Type Teste',
      email: 'user_type_teste@teste.com',
      password: '123456',
    })

    const response = await supertest(url)
      .post('/sessions')
      .send({ email: 'user_type_teste@teste.com', password: '123456' })

    AUTH_TOKEN = response.body.token
  })

  test('Create Type case data is valid', async () => {
    const newBet = {
      type: 'Lotodifícil',
      description:
        'Escolha 15 números para apostar na lotofácil. Você ganha acertando 11, 12, 13, 14 ou 15 números. São muitas chances de ganhar, e agora você joga de onde estiver!',
      range: 25,
      price: 2.5,
      max_number: 15,
      color: '#7F3992',
      min_cart_value: 30,
    }

    await supertest(url)
      .post('/types')
      .set('Authorization', 'bearer ' + AUTH_TOKEN)
      .send(newBet)
      .expect(200)
  })

  test('Must not allow Type creation if token is not provided', async (_) => {
    const newBet = {
      type: 'Lotodifícil',
      description:
        'Escolha 15 números para apostar na lotofácil. Você ganha acertando 11, 12, 13, 14 ou 15 números. São muitas chances de ganhar, e agora você joga de onde estiver!',
      range: 25,
      price: 2.5,
      max_number: 15,
      color: '#7F3992',
      min_cart_value: 30,
    }

    await supertest(url).post('/types').send(newBet).expect(401)
  })

  test('Creating multiple types case data is valid', async (_) => {
    const newBets = {
      types: [
        {
          type: 'Lotofácil',
          description:
            'Escolha 15 números para apostar na lotofácil. Você ganha acertando 11, 12, 13, 14 ou 15 números. São muitas chances de ganhar, e agora você joga de onde estiver!',
          range: 25,
          price: 2.5,
          max_number: 15,
          color: '#7F3992',
          min_cart_value: 30,
        },
        {
          type: 'Mega-Sena',
          description:
            'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
          range: 60,
          price: 4.5,
          max_number: 6,
          color: '#01AC66',
          min_cart_value: 30,
        },
        {
          type: 'Quina',
          description:
            'Escolha 5 números dos 80 disponíveis na quina. 5, 4, 3 ou 2 acertos. São seis sorteios semanais e seis chances de ganhar.',
          range: 80,
          price: 2,
          max_number: 5,
          color: '#F79C31',
          min_cart_value: 30,
        },
      ],
    }

    await supertest(url)
      .post('/types')
      .set('Authorization', 'bearer ' + AUTH_TOKEN)
      .send(newBets)
      .expect(200)
  })

  test('Update Type case data is valid', async (assert) => {
    const updatedTypeObject = {
      type: 'LotoLoto',
      description:
        'Escolha 15 números para apostar na lotofácil. Você ganha acertando 11, 12, 13, 14 ou 15 números. São muitas chances de ganhar, e agora você joga de onde estiver!',
      range: 25,
      price: 2.5,
      maxNumber: 15,
      color: '#7F3992',
      minCartValue: 30,
    }

    const typeIdToUpdate = 1
    await supertest(url)
      .put(`/types/${typeIdToUpdate}`)
      .set('Authorization', 'bearer ' + AUTH_TOKEN)
      .send(updatedTypeObject)
      .expect(200)
      .expect((res) => {
        const returnedType = res.body

        assert.deepStrictEqual<Type>(returnedType, {
          ...returnedType,
          ...updatedTypeObject,
        })
      })
  })

  test('Get Type infos by valid id', async (assert) => {
    const typeIdToRetrieve = 1

    const response = await supertest(url)
      .get(`/types/${typeIdToRetrieve}`)
      .set('Authorization', 'bearer ' + AUTH_TOKEN)
      .expect(200)

    assert.hasAllDeepKeys<Type>(response.body, [
      'id',
      'type',
      'description',
      'range',
      'price',
      'maxNumber',
      'color',
      'minCartValue',
      'updatedAt',
      'createdAt',
    ])
  })

  test('Get All Types', async (assert) => {
    const response = await supertest(url)
      .get(`/types`)
      .set('Authorization', 'bearer ' + AUTH_TOKEN)
      .expect(200)

    const types = response.body

    assert.isArray<Array<Type>>(types)
  })

  test('Delete Type by valid id', async (_) => {
    const typeIdToDelete = 1

    const response = await supertest(url)
      .delete(`/types/${typeIdToDelete}`)
      .set('Authorization', 'bearer ' + AUTH_TOKEN)
      .expect(200)
  })

  group.after(async () => {
    const response = await supertest(url)
      .get(`/types`)
      .set('Authorization', 'bearer ' + AUTH_TOKEN)
      .expect(200)
    console.log(response.body)
  })
})
