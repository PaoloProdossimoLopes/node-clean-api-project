import { IAccountModel } from '../models/account-model'

export interface AddAccountModel {
  name: string
  email: string
  password: String
}

export interface IAddAccount {
  add: (data: AddAccountModel) => IAccountModel
}
