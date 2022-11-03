import request from 'supertest'
import app from '../config/app'

describe('SignUpRoutes', () => {
  test('should return an account on success', async () => {
    const account = {
      name: 'Paolo',
      email: 'paolo.prodossimo.lopes@gmail.com',
      password: 'senha_para_test',
      passwordConfirmation: 'senha_para_test'
    }

    await request(app)
      .post('/api/signup')
      .send(account)
      .expect(200)
  })
})
