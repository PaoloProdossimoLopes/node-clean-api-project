import { HTTPResponse, HTTPRequest } from '../protocols/http'
import { MissinParamsError } from '../errors/missin-params-error'
import { badRequest } from '../helpers/http-helper'

export class SignUpController {
  handle (httpRequest: HTTPRequest): HTTPResponse {
    // if (!httpRequest.body.name) {
    //   const error = new MissinParamsError('nome')
    //   return badRequest(error)
    // }

    // if (!httpRequest.body.email) {
    //   const error = new MissinParamsError('email')
    //   return badRequest(error)
    // }

    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissinParamsError(field))
      }
    }
  }
}
