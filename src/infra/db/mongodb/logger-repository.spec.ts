import { Collection } from 'mongodb'
import { MongoLogResponsitory } from './logger-repository'
import { MongoHelper } from './helpers/mongo-helper'

describe('MongoLoggerRespository', () => {
  let collection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    collection = await MongoHelper.getCollection('errors')
    await collection.deleteMany({})
  })

  test('should create an error log on success', async () => {
    const sut = new MongoLogResponsitory()
    await sut.logError('any_error')
    const count = await collection.countDocuments()
    expect(count).toBe(1)
  })

  test('should create an error log on success twice', async () => {
    const sut = new MongoLogResponsitory()
    await sut.logError('any_error')
    await sut.logError('any_other_error')
    const count = await collection.countDocuments()
    expect(count).toBe(2)
  })
})
