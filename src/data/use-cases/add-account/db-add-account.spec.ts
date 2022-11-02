import { DBAddAccount } from './db-add-account'
import { IEncrypter } from '../../protocols/encrypt'

describe('DBAddAccount Usecase', async () => {
  test('should call `Encripter` with correct password', async () => {
    const encripter = new EncripterSpy()
    const sut = new DBAddAccount(encripter)
    const account = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(account)
    expect(encripter.passwordRecieved).toEqual('valid_password')
  })
})

// @Doubles
class EncripterSpy implements IEncrypter {
  passwordRecieved: string

  async encrypt (value: string): Promise<string> {
    this.passwordRecieved = value
    return new Promise((resolve) => resolve('hashed_password'))
  }
}
