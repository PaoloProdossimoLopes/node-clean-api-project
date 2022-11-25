import { InvalidParamError } from './../errors/invalid-param-error'
import { IValidator } from './../controllers/signup/validator'

export class CompareFieldsValidator implements IValidator {
  private readonly first: string
  private readonly second: string

  constructor (first: string, second: string) {
    this.first = first
    this.second = second
  }

  async validate (body: any): Promise<Error> {
    const isEqual = body[this.first] === body[this.second]
    if (!isEqual) {
      return new InvalidParamError(this.second)
    }
  }
}
