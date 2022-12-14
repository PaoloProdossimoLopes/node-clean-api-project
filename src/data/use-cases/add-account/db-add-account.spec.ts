import { DBAddAccount } from './db-add-account'
import { IEncrypter } from '../../protocols/encrypt'
import { AddAccountModel } from '@/domain/use-cases/add-account'
import { IAddAccountRepository } from '@/data/protocols/add-account-repository'
import { IAccountModel } from '@/domain/models/account-model'

describe('DBAddAccount Usecase', () => {
  test('should call `Encripter` with correct password', async () => {
    const { sut, encripter } = makeEnviroment()
    const account = makeAccount()
    await sut.add(account)
    expect(encripter.passwordRecieved).toEqual(makeValidPassword())
  })

  test('should throw if encripter throws', async () => {
    const { sut, encripter } = makeEnviroment()
    encripter.encryptReturns = new Promise((resolve, reject) => reject(new Error()))
    const primise = sut.add(makeAccount())
    await expect(primise).rejects.toThrow()
  })

  test('should call `AddAccountRepository` with correct object', async () => {
    const { sut, repository } = makeEnviroment()
    const account = makeAccount()
    await sut.add(account)

    const accountEncripted = Object.assign(account, { password: 'hashed_password' })
    expect(repository.accountRecieved).toEqual(accountEncripted)
  })

  test('should throw if addAccountRepository throws', async () => {
    const { sut, repository } = makeEnviroment()
    repository.throwsEpxpected = new Promise((resolve, reject) => reject(new Error()))
    const promise = sut.add(makeAccount())
    await expect(promise).rejects.toThrow()
  })

  test('`add` method should give an accont from db if all process succeds', async () => {
    const { sut } = makeEnviroment()
    const recieved = await sut.add(makeAccount())
    expect(recieved).toEqual(makeBDAccount())
  })
})

// @Helpers
interface Envirment {
  sut: DBAddAccount
  encripter: EncripterSpy
  repository: AddAccountRepositorySpy
}

const makeEnviroment = (): Envirment => {
  const encripter = new EncripterSpy()
  const repository = new AddAccountRepositorySpy()
  const sut = new DBAddAccount(encripter, repository)
  return { sut, encripter, repository }
}

const makeAccount = (): AddAccountModel => {
  return {
    name: makeValidName(),
    email: makeValidEmail(),
    password: makeValidPassword()
  }
}

const makeBDAccount = (): IAccountModel => {
  return {
    id: 'valid_id',
    name: makeValidName(),
    email: makeValidEmail(),
    password: 'hashed_password'
  }
}

const makeValidName = (): string => 'valid_name'
const makeValidEmail = (): string => 'valid_email'
const makeValidPassword = (): string => 'valid_password'

// @Test Doubles
class EncripterSpy implements IEncrypter {
  passwordRecieved: string
  encryptReturns?: Promise<string>

  async encrypt (value: string): Promise<string> {
    this.passwordRecieved = value

    if (this.encryptReturns) {
      return this.encryptReturns
    }

    return new Promise((resolve) => resolve('hashed_password'))
  }
}

class AddAccountRepositorySpy implements IAddAccountRepository {
  accountRecieved?: AddAccountModel
  throwsEpxpected?: Promise<IAccountModel>

  async add (account: AddAccountModel): Promise<IAccountModel> {
    this.accountRecieved = account

    if (this.throwsEpxpected) {
      return this.throwsEpxpected
    }

    return new Promise((resolve) => resolve(makeBDAccount()))
  }
}
