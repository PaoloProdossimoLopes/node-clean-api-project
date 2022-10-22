export interface AddAccountModel {
  name: string
  email: string
  password: String
}

export interface IAddAccount {
  add(data: AddAccountModel): void
}
