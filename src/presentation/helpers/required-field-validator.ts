import { MissinParamsError } from './../errors/missin-params-error'
import { IValidator } from './../controllers/signup/validator'

export class RequiredFieldValidator implements IValidator {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  async validate (body: any): Promise<Error> {
    if (!body[this.fieldName]) {
      return new MissinParamsError(this.fieldName)
    }
  }
}
