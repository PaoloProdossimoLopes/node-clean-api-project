import { EmailValiadatorAdapter } from './email-validator-adapter'
import validator from 'validator'

describe('EmailValidatorAdapter', () => {
  test('Returns false if validator returns false', () => {
    const sut = makeSUT()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBeFalsy()
  })

  test('Returns true if validator returns true', () => {
    const sut = makeSUT()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBeTruthy()
  })

  test('Call validator with correct email', () => {
    const sut = makeSUT()
    const validEmail = 'valid_email@mail.com'
    const emailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid(validEmail)
    expect(emailSpy).toHaveBeenCalledWith(validEmail)
  })
})

// @Helpers
const makeSUT = ((): EmailValiadatorAdapter => {
  return new EmailValiadatorAdapter()
})

// @Test doubles
jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))
