import { IAddAccountRepository } from '@/data/protocols/add-account-repository'
import { IAccountModel } from '@/domain/models/account-model'
import { AddAccountModel } from '@/domain/use-cases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { InsertOneResult } from 'mongodb'

export class AccountMongoRepository implements IAddAccountRepository {
  async add (account: AddAccountModel): Promise<IAccountModel> {
    const collection = MongoHelper.getCollection('accounts')
    const result = (await collection.insertOne(account))
    return await this.resultHandler(account, result)
  }

  private async resultHandler (account: AddAccountModel, result: InsertOneResult<Document>): Promise<IAccountModel> {
    if (result !== null) {
      const idRegistered = result.insertedId.toJSON()
      const accountRegistered = this.map(account, idRegistered)
      return new Promise((resolve) => resolve(accountRegistered))
    }

    return new Promise((resolve) => resolve(null))
  }

  private map (account: AddAccountModel, id: string): IAccountModel {
    return {
      id,
      name: account.name,
      email: account.email,
      password: account.password
    }
  }
}
