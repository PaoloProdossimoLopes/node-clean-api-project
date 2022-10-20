import { HTTPResponse, HTTPRequest } from '../protocols/http'
import { MissinParamsError } from '../errors/missin-params-error'

export class SignUpController {
  handle (httpRequest: HTTPRequest): HTTPResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissinParamsError('nome')
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissinParamsError('email')
      }
    }
  }
}
