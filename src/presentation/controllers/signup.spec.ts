import { SignUpController } from './signup'
import { MissinParamsError } from '../errors/missin-params-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { IEmailValidator } from '../protocols/email-validator'

describe('SignUpController', () => {
  test('Should return 400 if no `nome` is provided', () => {
    const sut = makeSUT()
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
    const sut = makeSUT()
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
    const sut = makeSUT()
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
    const sut = makeSUT()
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
    const sut = makeSUT()
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
})

function makeSUT (): SignUpController {
  const emailvalidator = new EmailValidatorStub()
  return new SignUpController(emailvalidator)
}

class EmailValidatorStub implements IEmailValidator {
  isValidExpected: boolean = false

  isValid (email: string): boolean {
    return this.isValidExpected
  }
}
