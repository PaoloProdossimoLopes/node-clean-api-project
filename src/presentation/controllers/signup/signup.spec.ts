import { badRequest } from './../../helpers/http-helper'
import { IValidator } from './validator'
import { SignUpController } from './signup'
import { MissinParamsError, InternalServerError } from '../../errors'
import { IAddAccount, AddAccountModel } from '../../../domain/use-cases/add-account'
import { IAccountModel } from '../../../domain/models/account-model'

describe('SignUpController', () => {
  test('Should response with statusCode 500 when Validator give us a throws with InternalServerError type', async () => {
    const { sut, validator } = makeSUT()
    validator.throws = new InternalServerError('any_error')
    const httpRequest = {
      body: {
        name: makeValidName(),
        email: makeInvalidEmail(),
        password: makeValidPassword(),
        passwordConfirmation: makeValidPassword()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toBeInstanceOf(InternalServerError)
  })

  test('When all field are valid should calls `add` method with correct datas', async () => {
    const { sut, addAccount } = makeSUT()
    const request = {
      body: {
        name: makeValidName(),
        email: makeValidEmail(),
        password: makeValidPassword(),
        passwordConfirmation: makeValidPassword()
      }
    }
    await sut.handle(request)
    expect(addAccount.addDataSpy).toEqual({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password
    })
  })

  test('Should response with statusCode 500 when `AddAccount` give us a throws with InternalServerError type', async () => {
    const { sut, addAccount } = makeSUT()
    addAccount.addDataThrows = new Error('any_error')
    const httpRequest = {
      body: {
        name: makeValidName(),
        email: makeValidEmail(),
        password: makeValidPassword(),
        passwordConfirmation: makeValidPassword()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toBeInstanceOf(InternalServerError)
  })

  test('Should response with statusCode 200 when `addAccount` provide valid data', async () => {
    const { sut, addAccount } = makeSUT()
    const request = {
      body: {
        name: makeValidName(),
        email: makeValidEmail(),
        password: makeValidPassword(),
        passwordConfirmation: makeValidPassword()
      }
    }

    const expectedModel = {
      id: makeValidID(),
      name: request.body.name,
      email: request.body.email,
      password: request.body.password
    }
    addAccount.addAccountModel = expectedModel

    const response = await sut.handle(request)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(expectedModel)
  })

  test('should call `Validation` with correct value', async () => {
    const { sut, validator } = makeSUT()
    const request = {
      body: {
        name: makeValidName(),
        email: makeValidEmail(),
        password: makeValidPassword(),
        passwordConfirmation: makeValidPassword()
      }
    }

    await sut.handle(request)
    expect(validator.validateCalledWith).toEqual(request.body)
  })

  test('should return 400 if validator returns an error', async () => {
    const { sut, validator } = makeSUT()
    const error = new MissinParamsError('any_migssing_param_error')
    validator.returnsError = error
    const response = await sut.handle({})
    expect(response).toEqual(badRequest(error))
  })
})

interface TestDependencies {
  sut: SignUpController
  addAccount: AddAccountStub
  validator: ValidatorSpy
}

const makeSUT = (): TestDependencies => {
  const addAccount = makeAddAccount()
  const validator = new ValidatorSpy()
  const sut = new SignUpController(addAccount, validator)
  return {
    sut,
    addAccount,
    validator
  }
}

const makeAddAccount = ((): AddAccountStub => {
  return new AddAccountStub()
})

// @Helepers
const makeValidID = (): string => 'any_valid_id'

const makeValidName = (): string => 'any_valid_name'

const makeValidEmail = (): string => 'any_valid_email@mail.com'

const makeInvalidEmail = (): string => 'any_invalid_email@mail.com'

const makeValidPassword = (): string => 'any_valid_password'

// @Test Doubles
class AddAccountStub implements IAddAccount {
  addDataSpy?: any
  addDataThrows?: Error
  addAccountModel = {
    id: makeValidID(),
    name: makeValidName(),
    email: makeValidEmail(),
    password: makeValidPassword()
  }

  async add (data: AddAccountModel): Promise<IAccountModel> {
    this.addDataSpy = data

    if (this.addDataThrows) {
      return new Promise((resolve, reject) => reject(this.addDataThrows))
    }

    return new Promise(resolve => resolve(this.addAccountModel))
  }
}

class ValidatorSpy implements IValidator {
  validateCalledWith?: any
  returnsError?: Error
  throws?: Error

  async validate (body: any): Promise<Error> {
    this.validateCalledWith = body
    if (this.throws) {
      throw this.throws
    }
    return this.returnsError
  }
}
