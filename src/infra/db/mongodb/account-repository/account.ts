import { IAddAccountRepository } from '@/data/protocols/add-account-repository'
import { IAccountModel } from '@/domain/models/account-model'
import { AddAccountModel } from '@/domain/use-cases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements IAddAccountRepository {
  async add (account: AddAccountModel): Promise<IAccountModel> {
    const collection = MongoHelper.getCollection('accounts')
    const result = (await collection.insertOne(account))
    if (result !== null) {
      return new Promise((resolve) => resolve({
        id: result.insertedId.toJSON(),
        name: account.name,
        email: account.email,
        password: account.password
      }))
    } else {
      return new Promise((resolve) => resolve(null))
    }
  }
}
