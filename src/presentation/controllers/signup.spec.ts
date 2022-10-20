import { SignUpController } from './signup'

describe('SignUpController', () => {
  test('Should return 400 if no nome is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_password',
        password: 'any_pasword_confimation'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: nome'))
  })

  test('Should return 400 if no email is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_email',
        password: 'any_pasword_confimation'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })
})
