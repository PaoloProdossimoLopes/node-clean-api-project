import { IAccountModel } from '../models/account-model'

export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface IAddAccount {
  add: (data: AddAccountModel) => Promise<IAccountModel>
}
