import { IToken } from './token'

export interface IAuthentication {
  auth: (email: string, password: string) => Promise<IToken>
}
