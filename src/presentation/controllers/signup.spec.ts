import { SignUpController } from './signup'
import { MissinParamsError } from '../errors/missin-params-error'

describe('SignUpController', () => {
  test('Should return 400 if no nome is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_password',
        password: 'any_pasword',
        passwordConfirmation: 'any_pasword_confimation'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamsError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_pasword',
        passwordConfirmation: 'any_pasword_confimation'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamsError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_password',
        name: 'any_name',
        passwordConfirmation: 'any_pasword_confimation'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamsError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_password',
        name: 'any_name',
        password: 'any_pasword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamsError('passwordConfirmation'))
  })
})
