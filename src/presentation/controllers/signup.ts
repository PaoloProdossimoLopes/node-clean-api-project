import { MissinParamsError, InvalidParamError } from '../errors'
import { badRequest, internalServerError } from '../helpers/http-helper'
import { IEmailValidator, Controller, HTTPResponse, HTTPRequest } from '../protocols'
import { IAddAccount } from '../../domain/use-cases/add-account'

export class SignUpController implements Controller {
  // @Properties
  private readonly emailValidator: IEmailValidator
  private readonly addAccount: IAddAccount

  // @Constructor
  constructor (emailValidator: IEmailValidator, addAccount: IAddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  // @Internals
  handle (httpRequest: HTTPRequest): HTTPResponse {
    try {
      return this.onHandler(httpRequest)
    } catch (error) { return internalServerError() }
  }

  // @Helpers
  private onHandler (request: HTTPRequest): HTTPResponse {
    const missingParamError = this.checkRequiredFields(request.body)
    if (missingParamError) {
      return badRequest(missingParamError)
    }

    const { name, email, password, passwordConfirmation } = request.body
    if (!this.emailValidator.isValid(email)) {
      return badRequest(new InvalidParamError(this.kEmail))
    }

    if (!this.comparePasswords(password, passwordConfirmation)) {
      return badRequest(new InvalidParamError(this.kPasswordConfirmation))
    }

    const shortHandSyntaxData = { name, email, password }
    this.addAccount.add(shortHandSyntaxData)
  }

  private comparePasswords (password: string, confirmation: string): boolean {
    return password === confirmation
  }

  private checkRequiredFields (body?: any): Error {
    const requiredFields = [
      this.kName, this.kEmail,
      this.kPassword, this.kPasswordConfirmation
    ]
    for (const field of requiredFields) {
      if (!body[field]) { return new MissinParamsError(field) }
    }
  }

  // @Constants
  private readonly kName = 'name'
  private readonly kEmail = 'email'
  private readonly kPassword = 'password'
  private readonly kPasswordConfirmation = 'passwordConfirmation'
}
