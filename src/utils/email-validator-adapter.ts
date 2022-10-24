import { IEmailValidator } from '../presentation/protocols/email-validator'

export class EmailValiadatorAdapter implements IEmailValidator {
  isValid (email: string): boolean {
    return false
  }
}
