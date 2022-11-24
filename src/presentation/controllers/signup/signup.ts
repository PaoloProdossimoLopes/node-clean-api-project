import { IValidator } from './validator'
import { MissinParamsError, InvalidParamError } from '../../errors'
import { badRequest, internalServerError, ok } from '../../helpers/http-helper'
import { IEmailValidator, IController, HTTPResponse, HTTPRequest } from '../../protocols'
import { IAddAccount } from '../../../domain/use-cases/add-account'

export class SignUpController implements IController {
  // @Properties
  private readonly emailValidator: IEmailValidator
  private readonly addAccount: IAddAccount
  private readonly validator: IValidator

  // @Constructor
  constructor (emailValidator: IEmailValidator, addAccount: IAddAccount, validator: IValidator) {
    this.emailValidator = emailValidator
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

    const missingParamError = this.checkRequiredFields(request.body)
    if (missingParamError) {
      return badRequest(missingParamError)
    }

    const { name, email, password, passwordConfirmation } = request.body
    if (!this.emailValidator.isValid(email)) {
      return badRequest(new InvalidParamError(this.Constant.email))
    }

    if (!this.comparePasswords(password, passwordConfirmation)) {
      return badRequest(new InvalidParamError(this.Constant.passwordConfirmation))
    }

    const shortHandSyntaxData = { name, email, password }
    const accountModel = await this.addAccount.add(shortHandSyntaxData)
    return ok(accountModel)
  }

  private comparePasswords (password: string, confirmation: string): boolean {
    return password === confirmation
  }

  private checkRequiredFields (body?: any): Error {
    const requiredFields = [
      this.Constant.name, this.Constant.email,
      this.Constant.password, this.Constant.passwordConfirmation
    ]
    for (const field of requiredFields) {
      if (!body[field]) { return new MissinParamsError(field) }
    }
  }

  // @Constants
  private readonly Constant = {
    name: 'name',
    email: 'email',
    password: 'password',
    passwordConfirmation: 'passwordConfirmation'
  }
}
