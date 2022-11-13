import { MissinParamsError } from './../../errors/missin-params-error'
import { HTTPRequest, HTTPResponse } from '@/presentation/protocols'
import { IController } from './../../protocols/controller'
import { badRequest } from '../../helpers/http-helper'

export class LoginController implements IController {
  async handle (httpRequest: HTTPRequest): Promise<HTTPResponse> {
    if (!httpRequest.body) {
      return badRequest(new MissinParamsError('body'))
    } else if (!httpRequest.body?.name) {
      return badRequest(new MissinParamsError('name'))
    } else if (!httpRequest.body?.password) {
      return badRequest(new MissinParamsError('password'))
    }
    return new Promise(resolve => resolve(null))
  }
}
