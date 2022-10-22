import { MissinParamsError, InvalidParamError } from '../errors'
import { badRequest, internalServerError } from '../helpers/http-helper'
import { IEmailValidator, Controller, HTTPResponse, HTTPRequest } from '../protocols'

export class SignUpController implements Controller {
  // @Properties
  private readonly emailValidator: IEmailValidator

  // @Constructor
  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
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

    if (request.body.password !== request.body.passwordConfirmation) {
      return badRequest(new InvalidParamError('passwordConfirmation'))
    }

    const emailIsValid = this.emailValidator.isValid(request.body.email)
    if (!emailIsValid) {
      return badRequest(new InvalidParamError(this.kEmailIsIvalid))
    }
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
  private readonly kEmailIsIvalid = 'email'
}
