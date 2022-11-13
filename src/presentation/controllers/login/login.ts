import { InvalidParamError } from './../../errors/invalid-param-error';
import { IEmailValidator } from './../../protocols/email-validator'
import { MissinParamsError } from './../../errors/missin-params-error'
import { HTTPRequest, HTTPResponse } from '@/presentation/protocols'
import { IController } from './../../protocols/controller'
import { badRequest } from '../../helpers/http-helper'

export class LoginController implements IController {
  private readonly validator: IEmailValidator

  constructor (validator: IEmailValidator) {
    this.validator = validator
  }

  async handle (httpRequest: HTTPRequest): Promise<HTTPResponse> {
    const badRequestError = this.validadeRequiredFilds(httpRequest)
    if (badRequestError) { return badRequest(badRequestError) }

    const isValid = this.validator.isValid(httpRequest.body.email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }

    const successObject = {
      statusCode: 200,
      body: null
    }
    return successObject
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
