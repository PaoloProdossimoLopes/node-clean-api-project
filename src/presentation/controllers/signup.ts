import { MissinParamsError, InvalidParamError } from '../errors'
import { badRequest, internalServerError } from '../helpers/http-helper'
import { IEmailValidator, Controller, HTTPResponse, HTTPRequest } from '../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: IEmailValidator

  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HTTPRequest): HTTPResponse {
    try {
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
    } catch (error) {
      return internalServerError()
    }
  }
}
