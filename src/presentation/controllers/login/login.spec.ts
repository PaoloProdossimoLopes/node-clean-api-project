import { EmailValidatorStub } from './../helpers/EmailValidatorStub';
import { MissinParamsError } from './../../errors/missin-params-error'
import { LoginController } from './login'

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
})

interface Enviroment {
  sut: LoginController
  validator: EmailValidatorStub
}

const makeEnviroment = (): Enviroment => {
  const validator = new EmailValidatorStub()
  const sut = new LoginController(validator)
  return {
    sut,
    validator
  }
}
