import { IAccountModel } from '@/domain/models/account-model'
import { AddAccountModel } from '@/domain/use-cases/add-account'

export interface IAddAccountRepository {
  add: (account: AddAccountModel) => Promise<IAccountModel>
}
