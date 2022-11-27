import { IValidator } from './validator'
import { badRequest, internalServerError, ok } from '../../helpers/http-helper'
import { IController, HTTPResponse, HTTPRequest } from '../../protocols'
import { IAddAccount } from '../../../domain/use-cases/add-account'

export class SignUpController implements IController {
  // @Properties
  private readonly addAccount: IAddAccount
  private readonly validator: IValidator

  // @Constructor
  constructor (addAccount: IAddAccount, validator: IValidator) {
    this.addAccount = addAccount
    this.validator = validator
  }

  // @Internals
  async handle (httpRequest: HTTPRequest): Promise<HTTPResponse> {
    try {
      return await this.onHandler(httpRequest)
    } catch (error) { return internalServerError(error) }
  }

  // @Helpers
  private async onHandler (request: HTTPRequest): Promise<HTTPResponse> {
    const validationError = await this.validator.validate(request.body)
    if (validationError) {
      return badRequest(validationError)
    }

    const { name, email, password } = request.body

    const shortHandSyntaxData = { name, email, password }
    const accountModel = await this.addAccount.add(shortHandSyntaxData)
    return ok(accountModel)
  }
}
