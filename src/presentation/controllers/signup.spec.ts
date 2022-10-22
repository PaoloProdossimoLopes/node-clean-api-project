import { SignUpController } from './signup'
import { MissinParamsError, InternalServerError, InvalidParamError } from '../errors'
import { IEmailValidator } from '../protocols'
import { IAddAccount, AddAccountModel } from '../../domain/use-cases/add-account'
import { IAccountModel } from '../../domain/models/account-model'

describe('SignUpController', () => {
  test('Should return 400 if no `nome` is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pasword',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamsError('name'))
  })

  test('Should return 400 if no `email` is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_pasword',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamsError('email'))
  })

  test('Should return 400 if no `password` is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamsError('password'))
  })

  test('Should return 400 if no `passwordConfirmation` is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_pasword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamsError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidator } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(emailValidator.isValidEmailSpy).toEqual('any_invalid_email')
  })

  test('Should call `isValid` with correct email', async () => {
    const { sut, emailValidator } = makeSUT()
    emailValidator.isValidExpected = false
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should response with statusCode 500 when Validator give us a throws with InternalServerError type', async () => {
    const { sut, emailValidator } = makeSUT()
    emailValidator.isValidThrows = new InternalServerError()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toBeInstanceOf(InternalServerError)
  })

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_other_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('When all field are valid should calls `add` method with correct datas', async () => {
    const { sut, addAccount } = makeSUT()
    const request = {
      body: {
        name: 'any_name',
        email: 'any_invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
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
        name: 'any_name',
        email: 'any_invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
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
        name: 'any_name',
        email: 'any_invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const expectedModel = {
      id: 'valid_id',
      name: request.body.name,
      email: request.body.email,
      password: request.body.password
    }
    addAccount.addAccountModel = expectedModel

    const response = await sut.handle(request)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(expectedModel)
  })
})

interface TestDependencies {
  sut: SignUpController
  emailValidator: EmailValidatorStub
  addAccount: AddAccountStub
}

const makeSUT = (): TestDependencies => {
  const emailValidator = makeEmailValidator()
  const addAccount = makeAddAccount()
  const sut = new SignUpController(emailValidator, addAccount)
  return {
    sut,
    emailValidator,
    addAccount
  }
}

class EmailValidatorStub implements IEmailValidator {
  isValidExpected: boolean = true
  isValidEmailSpy?: string
  isValidThrows?: Error

  isValid (email: string): boolean {
    this.isValidEmailSpy = email

    if (this.isValidThrows) {
      throw this.isValidThrows
    }

    return this.isValidExpected
  }
}

const makeEmailValidator = ((): EmailValidatorStub => {
  return new EmailValidatorStub()
})

const makeAddAccount = ((): AddAccountStub => {
  return new AddAccountStub()
})

class AddAccountStub implements IAddAccount {
  addDataSpy?: any
  addDataThrows?: Error
  addAccountModel = {
    id: 'any_valid_id',
    name: 'any_valid_name',
    email: 'any_valid_email',
    password: 'any_valid_password'
  }

  async add (data: AddAccountModel): Promise<IAccountModel> {
    this.addDataSpy = data

    if (this.addDataThrows) {
      return new Promise((resolve, reject) => reject(this.addDataThrows))
    }

    return new Promise(resolve => resolve(this.addAccountModel))
  }
}
