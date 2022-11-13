import { IEmailValidator } from './../../protocols/email-validator'

export class EmailValidatorStub implements IEmailValidator {
  isValidExpected: boolean = true
  isValidEmailSpy?: string
  isValidThrows?: Error

  isValid (email: string): boolean {
    this.isValidEmailSpy = email

    if (this.isValidThrows) {
      throw this.isValidThrows
    }

    return this.isValidExpected
  }
}
