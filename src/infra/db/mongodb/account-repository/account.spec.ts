import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { AccountMongoRepository } from './account'

let accountCollection: Collection

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add', () => {
    test('Should return an account on success', async () => {
      const sut = new AccountMongoRepository()
      const account = await sut.add({
        name: 'name',
        email: 'email',
        password: 'password'
      })
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('name')
      expect(account.email).toBe('email')
      expect(account.password).toBe('password')
    })
  })
})
