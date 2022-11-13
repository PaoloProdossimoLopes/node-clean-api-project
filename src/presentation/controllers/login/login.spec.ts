import { MissinParamsError } from './../../errors/missin-params-error'
import { LoginController } from './login'

describe('LoginController', () => {
  test('should return 400 if no body is provided', async () => {
    const sut = makeSUT()
    const request = {
      body: null
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissinParamsError('body'))
  })

  test('should return 400 if no `email` is provided', async () => {
    const sut = makeSUT()
    const request = {
      body: {
        password: 'any_valid_password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissinParamsError('email'))
  })

  test('should return 400 if no `password` is provided', async () => {
    const sut = makeSUT()
    const request = {
      body: {
        email: 'any_valid_name'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissinParamsError('password'))
  })

  test('should return 200 if all values are provided correctly', async () => {
    const sut = makeSUT()
    const request = {
      body: {
        password: 'any_valid_password',
        email: 'any_valid_email@mail.com'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(200)
  })
})

const makeSUT = (): LoginController => {
  return new LoginController()
}
