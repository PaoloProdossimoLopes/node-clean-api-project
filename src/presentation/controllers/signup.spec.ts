import { SignUpController } from "./signup"

describe('SignUpController', () => {
  test('Should return 400 if no nome is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        // name: 'any_email',
        email: 'any_password',
        password: 'any_pasword_confimation'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})