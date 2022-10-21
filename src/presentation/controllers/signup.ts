import { HTTPResponse, HTTPRequest } from '../protocols/http'
import { IEmailValidator } from '../protocols/email-validator'
import { MissinParamsError } from '../errors/missin-params-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { InvalidParamError } from '../errors/invalid-param-error'

export class SignUpController implements Controller {
  private readonly emailValidator: IEmailValidator

  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HTTPRequest): HTTPResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissinParamsError(field))
      }
    }

    const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!emailIsValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
