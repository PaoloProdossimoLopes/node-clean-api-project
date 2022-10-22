import { SignUpController } from './signup'
import { MissinParamsError, InternalServerError, InvalidParamError } from '../errors'
import { IEmailValidator } from '../protocols'
import { IAddAccount } from '../../domain/use-cases/add-account'

describe('SignUpController', () => {
  test('Should return 400 if no `nome` is provided', () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pasword',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamsError('name'))
  })

  test('Should return 400 if no `email` is provided', () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_pasword',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamsError('email'))
  })

  test('Should return 400 if no `password` is provided', () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamsError('password'))
  })

  test('Should return 400 if no `passwordConfirmation` is provided', () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_pasword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamsError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidator } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    sut.handle(httpRequest)
    expect(emailValidator.isValidEmailSpy).toEqual('any_invalid_email')
  })

  test('Should call `isValid` with correct email', () => {
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
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should response with statusCode 500 when Validator give us a throws with InternalServerError type', () => {
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
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toBeInstanceOf(InternalServerError)
  })

  test('Should return 400 if password confirmation fails', () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_other_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('When all field are valid should calls `add` method with correct datas', () => {
    const { sut, addAccount } = makeSUT()
    const request = {
      body: {
        name: 'any_name',
        email: 'any_invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    sut.handle(request)
    expect(addAccount.addDataSpy).toEqual({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password
    })
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

  add (data: any): void {
    this.addDataSpy = data

    if (this.addDataThrows) {
      throw this.addDataThrows
    }
  }
}
