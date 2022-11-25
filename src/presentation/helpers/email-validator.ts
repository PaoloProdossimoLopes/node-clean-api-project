import { InvalidParamError } from './../errors/invalid-param-error'
import { IEmailValidator } from './../protocols/email-validator'
import { EmailValiadatorAdapter } from '@/utils/email-validator-adapter'
import { IValidator } from './../controllers/signup/validator'

export class EmailValiadtor implements IValidator {
  private readonly validator: EmailValiadatorAdapter

  constructor (validator: IEmailValidator) {
    this.validator = validator
  }

  async validate (body: any): Promise<Error> {
    const isValid = this.validator.isValid(body.email)
    if (!isValid) {
      return new InvalidParamError('email')
    }
  }
}
