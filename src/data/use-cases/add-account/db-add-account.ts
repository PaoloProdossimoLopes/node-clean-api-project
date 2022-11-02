import { AddAccountModel, IAddAccount } from '../../../domain/use-cases/add-account'
import { IAccountModel } from '../../../domain/models/account-model'
import { IEncrypter } from '../../protocols/encrypt'
import { IAddAccountRepository } from '../../protocols/add-account-repository'

export class DBAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter
  private readonly repository: IAddAccountRepository

  constructor (encrypter: IEncrypter, repository: IAddAccountRepository) {
    this.encrypter = encrypter
    this.repository = repository
  }

  async add (data: AddAccountModel): Promise<IAccountModel> {
    const passwordEncrypted = await this.encrypter.encrypt(data.password)
    const repositoryAccount = Object.assign({}, data, { password: passwordEncrypted })
    const account = await this.repository.add(repositoryAccount)
    return account
  }
}
