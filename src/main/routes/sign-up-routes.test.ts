import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add', () => {
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
})
