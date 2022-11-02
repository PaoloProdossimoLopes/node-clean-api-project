import { DBAddAccount } from './db-add-account'
import { IEncrypter } from '../../protocols/encrypt'

describe('DBAddAccount Usecase', async () => {
  test('should call `Encripter` with correct password', async () => {
    const { sut, encripter } = makeEnviroment()
    const account = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(account)
    expect(encripter.passwordRecieved).toEqual('valid_password')
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

// @Doubles
class EncripterSpy implements IEncrypter {
  passwordRecieved: string

  async encrypt (value: string): Promise<string> {
    this.passwordRecieved = value
    return new Promise((resolve) => resolve('hashed_password'))
  }
}
