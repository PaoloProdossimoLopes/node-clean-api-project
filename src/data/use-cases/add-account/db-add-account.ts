import { AddAccountModel, IAddAccount } from '../../../domain/use-cases/add-account'
import { IAccountModel } from '../../../domain/models/account-model'
import { IEncrypter } from '../../protocols/encrypt'

export class DBAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter

  constructor (encrypter: IEncrypter) {
    this.encrypter = encrypter
  }

  async add (data: AddAccountModel): Promise<IAccountModel> {
    const encrypted = await this.encrypter.encrypt(data.password)
    return new Promise(resolve => resolve(null))
  }
}
