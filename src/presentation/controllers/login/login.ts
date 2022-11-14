import { IAuthentication } from './../../../domain/use-cases/authentication/authenticator'
import { InternalServerError } from './../../errors/internal-server-error'
import { internalServerError } from './../../helpers/http-helper'
import { InvalidParamError } from './../../errors/invalid-param-error'
import { IEmailValidator } from './../../protocols/email-validator'
import { MissinParamsError } from './../../errors/missin-params-error'
import { HTTPRequest, HTTPResponse } from '@/presentation/protocols'
import { IController } from './../../protocols/controller'
import { badRequest } from '../../helpers/http-helper'

export class LoginController implements IController {
  private readonly validator: IEmailValidator
  private readonly authenticator: IAuthentication

  constructor (validator: IEmailValidator, authenticator: IAuthentication) {
    this.validator = validator
    this.authenticator = authenticator
  }

  async handle (httpRequest: HTTPRequest): Promise<HTTPResponse> {
    try {
      const badRequestError = this.validadeRequiredFilds(httpRequest)
      if (badRequestError) { return badRequest(badRequestError) }

      const isValid = this.validator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      await this.authenticator.auth(httpRequest.body.email, httpRequest.body.password)

      const successObject = {
        statusCode: 200,
        body: null
      }
      return successObject
    } catch {
      return internalServerError(new InternalServerError())
    }
  }

  // @Helpers
  private validadeRequiredFilds (request: HTTPRequest): Error {
    const required = ['email', 'password']
    for (const field of required) {
      if (!request.body) {
        return new MissinParamsError('body')
      } else if (!request.body[field]) {
        return new MissinParamsError(field)
      }
    }
  }
}
