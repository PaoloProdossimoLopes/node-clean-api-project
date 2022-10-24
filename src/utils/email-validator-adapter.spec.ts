import { EmailValiadatorAdapter } from './email-validator-adapter'
import validator from 'validator'

describe('EmailValidatorAdapter', () => {
  test('Returns false if validator returns false', () => {
    const sut = makeSUT()
    jest.spyOn(validator, kValidatorIsValidMethodName).mockReturnValueOnce(false)
    const isValid = sut.isValid(makeInvalidEmail())
    expect(isValid).toBeFalsy()
  })

  test('Returns true if validator returns true', () => {
    const sut = makeSUT()
    const isValid = sut.isValid(makeValidEmail())
    expect(isValid).toBeTruthy()
  })

  test('Call validator with correct email', () => {
    const sut = makeSUT()
    const validEmail = makeValidEmail()
    const emailSpy = jest.spyOn(validator, kValidatorIsValidMethodName)
    sut.isValid(validEmail)
    expect(emailSpy).toHaveBeenCalledWith(validEmail)
  })
})

// @Helpers
const makeSUT = ((): EmailValiadatorAdapter => {
  return new EmailValiadatorAdapter()
})

const makeValidEmail = (): string => 'valid_email@mail.com'

const makeInvalidEmail = (): string => 'invalid_email@mail.com'

const kValidatorIsValidMethodName = 'isEmail'

// @Test doubles
jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))
