import { DBAddAccount } from './db-add-account'
import { IEncrypter } from '../../protocols/encrypt'
import { AddAccountModel } from '@/domain/use-cases/add-account'

describe('DBAddAccount Usecase', async () => {
  test('should call `Encripter` with correct password', async () => {
    const { sut, encripter } = makeEnviroment()
    const account = makeAccount()
    await sut.add(account)
    expect(encripter.passwordRecieved).toEqual(makeValidPassword())
  })
})

// @Helpers
interface Envirment {
  sut: DBAddAccount
  encripter: EncripterSpy
}

const makeEnviroment = (): Envirment => {
  const encripter = new EncripterSpy()
  const sut = new DBAddAccount(encripter)
  return { sut, encripter }
}

const makeAccount = (): AddAccountModel => {
  return {
    name: makeValidName(),
    email: makeValidEmail(),
    password: makeValidPassword()
  }
}

const makeValidName = (): string => 'valid_name'
const makeValidEmail = (): string => 'valid_email'
const makeValidPassword = (): string => 'valid_password'

// @Doubles
class EncripterSpy implements IEncrypter {
  passwordRecieved: string

  async encrypt (value: string): Promise<string> {
    this.passwordRecieved = value
    return new Promise((resolve) => resolve('hashed_password'))
  }
}
