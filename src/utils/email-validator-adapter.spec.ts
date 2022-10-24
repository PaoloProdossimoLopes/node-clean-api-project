import { EmailValiadatorAdapter } from './email-validator-adapter'

describe('EmailValidatorAdapter', () => {
  test('Returns false if validator returns false', () => {
    const sut = new EmailValiadatorAdapter()
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBeFalsy()
  })
})
