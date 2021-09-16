import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'
import url from '../base_url'

test.group('Auth tests', (group) => {
  group.before(async () => {
    await User.create({
      name: 'User Teste',
      email: 'user_teste@teste.com',
      password: '123456',
    })
  })

  test('Must return user information and token when valid credentials are sent', async (assert) => {
    const userCredentials = {
      email: 'user_teste@teste.com',
      password: '123456',
    }

    const result = await supertest(url).post('/sessions').send(userCredentials)

    assert.hasAllKeys(result.body, ['email', 'id', 'name', 'token', 'is_admin'])
  })
})
