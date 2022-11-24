import { unauthorizedError } from './../../helpers/http-helper'
import { IToken } from './../../../domain/use-cases/authentication/token'
import { InternalServerError } from './../../errors/internal-server-error'
import { InvalidParamError } from './../../errors/invalid-param-error'
import { EmailValidatorStub } from './../helpers/EmailValidatorStub'
import { MissinParamsError } from './../../errors/missin-params-error'
import { LoginController } from './login'
import { IAuthentication } from '@/domain/use-cases/authentication/authenticator'

describe('LoginController', () => {
  test('should return 400 if no body is provided', async () => {
    const { sut } = makeEnviroment()
    const request = {
      body: null
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissinParamsError('body'))
  })

  test('should return 400 if no `email` is provided', async () => {
    const { sut } = makeEnviroment()
    const request = {
      body: { password: 'any_valid_password' }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissinParamsError('email'))
  })

  test('should return 400 if no `password` is provided', async () => {
    const { sut } = makeEnviroment()
    const request = {
      body: { email: 'any_valid_email@mail.com' }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissinParamsError('password'))
  })

  test('should return 200 if all values are provided correctly', async () => {
    const { sut } = makeEnviroment()
    const request = {
      body: {
        password: 'any_valid_password',
        email: 'any_valid_email@mail.com'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(200)
  })

  test('should call email validator with correct email', async () => {
    const { sut, validator } = makeEnviroment()
    const expected = 'any_valid_email@mail.com'
    const request = {
      body: {
        password: 'any_valid_password',
        email: expected
      }
    }
    await sut.handle(request)
    expect(validator.isValidEmailSpy).toBe(expected)
  })

  test('should returns 400 with invalid param error when email is invalid', async () => {
    const { sut, validator } = makeEnviroment()
    const request = {
      body: {
        password: 'any_valid_password',
        email: 'any_invalid_email@mail.com'
      }
    }
    validator.isValidExpected = false
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })

  test('should returns 400 with invalid param error when email is invalid', async () => {
    const { sut, validator } = makeEnviroment()
    const request = {
      body: {
        password: 'any_valid_password',
        email: 'any_invalid_email@mail.com'
      }
    }
    validator.isValidThrows = new Error('any_internal_error')
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new InternalServerError())
  })

  test('should return 401 if invalid credentions are provided', async () => {
    const { sut, authenticator } = makeEnviroment()
    const request = {
      body: {
        password: 'any_valid_password',
        email: 'any_invalid_email@mail.com'
      }
    }
    authenticator.authReturnExpected = null
    const resposne = await sut.handle(request)
    expect(resposne).toEqual(unauthorizedError())
  })

  test('should call authentication with correct values', async () => {
    const { sut, authenticator } = makeEnviroment()
    const request = {
      body: {
        password: 'any_valid_password',
        email: 'any_invalid_email@mail.com'
      }
    }
    await sut.handle(request)
    expect(authenticator.emailParamSpy).toEqual(request.body.email)
    expect(authenticator.passwordParamSpy).toEqual(request.body.password)
  })

  test('should return 200 if valid credential are provided', async () => {
    const { sut, authenticator } = makeEnviroment()
    const request = {
      body: {
        password: 'any_valid_password',
        email: 'any_invalid_email@mail.com'
      }
    }
    const response = await sut.handle(request)
    expect(response.body).toEqual({ accessToken: authenticator.authReturnExpected })
  })
})

interface Enviroment {
  sut: LoginController
  validator: EmailValidatorStub
  authenticator: AuthenticatorSpy
}

const makeEnviroment = (): Enviroment => {
  const validator = new EmailValidatorStub()
  const authenticator = new AuthenticatorSpy()
  const sut = new LoginController(validator, authenticator)
  return {
    sut,
    validator,
    authenticator
  }
}

class AuthenticatorSpy implements IAuthentication {
  emailParamSpy?: string
  passwordParamSpy?: string
  authReturnExpected?: IToken = { token: 'any_token' }

  async auth (email: string, password: string): Promise<IToken> {
    this.emailParamSpy = email
    this.passwordParamSpy = password
    return this.authReturnExpected
  }
}
