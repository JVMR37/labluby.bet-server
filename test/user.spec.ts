import test from 'japa'
import supertest from 'supertest'
import url from '../base_url'

test.group('User routes tests', () => {
  test('make sure the user will be created successfully', async (assert) => {
    const user = {
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
    }

    const result = await supertest(url).post('/users').send(user).expect(200)
    assert.isNotNull(result)
  })
})
