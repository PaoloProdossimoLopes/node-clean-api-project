import { IValidator } from './../controllers/signup/validator'

export class ValidatorComposite implements IValidator {
  private readonly validations: IValidator[]

  constructor (validations: IValidator[]) {
    this.validations = validations
  }

  async validate (body: any): Promise<Error> {
    for (const validation of this.validations) {
      const error = await validation.validate(body)
      if (error) { return error }
    }
  }
}
