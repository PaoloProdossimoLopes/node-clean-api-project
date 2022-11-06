import { Controller } from './../../presentation/protocols/controller'
import { HTTPRequest, HTTPResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller

  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (httpRequest: HTTPRequest): Promise<HTTPResponse> {
    const response = await this.controller.handle(httpRequest)

    if (response.statusCode === 500) {
      console.log('DEBUG Error')
    }

    return response
  }
}
