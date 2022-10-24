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
        email: makeValidEmail(),
        password: makeValidPassword(),
        passwordConfirmation: makeValidPassword()
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
        name: makeValidName(),
        password: makeValidPassword(),
        passwordConfirmation: makeValidPassword()
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
        email: makeValidEmail(),
        name: makeValidName(),
        passwordConfirmation: makeValidPassword()
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
        email: makeValidEmail(),
        name: makeValidName(),
        password: makeValidPassword()
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
        name: makeValidName(),
        email: makeInvalidEmail(),
        password: makeValidPassword(),
        passwordConfirmation: makeValidPassword()
      }
    }
    await sut.handle(httpRequest)
    expect(emailValidator.isValidEmailSpy).toEqual(makeInvalidEmail())
  })

  test('Should call `isValid` with correct email', async () => {
    const { sut, emailValidator } = makeSUT()
    emailValidator.isValidExpected = false
    const httpRequest = {
      body: {
        name: makeValidName(),
        email: makeValidEmail(),
        password: makeValidPassword(),
        passwordConfirmation: makeValidPassword()
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

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: makeValidName(),
        email: makeValidEmail(),
        password: makeValidPassword(),
        passwordConfirmation: makeInvalidPassword()
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

const makeEmailValidator = ((): EmailValidatorStub => {
  return new EmailValidatorStub()
})

const makeAddAccount = ((): AddAccountStub => {
  return new AddAccountStub()
})

// @Helepers
const makeValidID = (): string => 'any_valid_id'

const makeValidName = (): string => 'any_valid_name'

const makeValidEmail = (): string => 'any_valid_email@mail.com'

const makeInvalidEmail = (): string => 'any_invalid_email@mail.com'

const makeValidPassword = (): string => 'any_valid_password'

const makeInvalidPassword = (): string => 'any_invalid_password'

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
