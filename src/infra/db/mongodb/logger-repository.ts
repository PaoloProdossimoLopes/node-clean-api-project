import { MongoHelper } from './helpers/mongo-helper'
import { ILogger } from './../../../data/protocols/logger'

export class MongoLogResponsitory implements ILogger {
  async logError (message: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    const object = {
      message,
      date: new Date()
    }
    await errorCollection.insertOne(object)
  }
}
