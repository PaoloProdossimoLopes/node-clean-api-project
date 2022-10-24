import { EmailValiadatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidatorAdapter', () => {
  test('Returns false if validator returns false', () => {
    const sut = new EmailValiadatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBeFalsy()
  })

  test('Returns true if validator returns true', () => {
    const sut = new EmailValiadatorAdapter()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBeTruthy()
  })

  test('Call validator with correct email', () => {
    const sut = new EmailValiadatorAdapter()
    const validEmail = 'valid_email@mail.com'
    const emailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid(validEmail)
    expect(emailSpy).toHaveBeenCalledWith(validEmail)
  })
})
