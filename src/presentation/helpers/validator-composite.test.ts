import { InvalidParamError } from './../errors/invalid-param-error'
import { MissinParamsError } from './../errors/missin-params-error'
import { makeCompositeValidator } from './../../main/factories/sign-up-validator'

describe('ValidatorComposite Intergration', () => {
  test('should return 400 if name is not provided', async () => {
    const body = {
      email: 'any_email',
      password: 'any',
      passwordConfirmation: 'passwordConfirmation'
    }
    const validator = makeCompositeValidator()
    const error = await validator.validate(body)
    expect(error).toEqual(new MissinParamsError('name'))
  })

  test('should return 400 if email is not provided', async () => {
    const body = {
      name: 'any_name',
      password: 'any_password',
      passwordConfirmation: 'passwordConfirmation'
    }
    const validator = makeCompositeValidator()
    const error = await validator.validate(body)
    expect(error).toEqual(new MissinParamsError('email'))
  })

  test('should return 400 if password is not provided', async () => {
    const body = {
      name: 'any_name',
      email: 'any_email@mail.com',
      passwordConfirmation: 'passwordConfirmation'
    }
    const validator = makeCompositeValidator()
    const error = await validator.validate(body)
    expect(error).toEqual(new MissinParamsError('password'))
  })

  test('should return 400 if cofirmation is not provided', async () => {
    const body = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    const validator = makeCompositeValidator()
    const error = await validator.validate(body)
    expect(error).toEqual(new MissinParamsError('passwordConfirmation'))
  })

  test('should return 400 if confirmation is not euqla password', async () => {
    const body = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_passwords'
    }
    const validator = makeCompositeValidator()
    const error = await validator.validate(body)
    expect(error).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('should return 400 if email is invalid', async () => {
    const body = {
      name: 'any_name',
      email: 'any_invalid_email',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    const validator = makeCompositeValidator()
    const error = await validator.validate(body)
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('should returns null whem all values are correct', async () => {
    const body = {
      name: 'any_name',
      email: 'any_valid_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    const validator = makeCompositeValidator()
    const error = await validator.validate(body)
    expect(error).toBeFalsy()
  })
})
