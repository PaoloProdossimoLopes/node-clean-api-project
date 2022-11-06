import { ILogger } from '../../data/protocols/logger'
import { Controller } from './../../presentation/protocols/controller'
import { HTTPRequest, HTTPResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly repository: ILogger

  constructor (controller: Controller, repository: ILogger) {
    this.controller = controller
    this.repository = repository
  }

  async handle (httpRequest: HTTPRequest): Promise<HTTPResponse> {
    const response = await this.controller.handle(httpRequest)

    if (response.statusCode === 500) {
      this.repository.log(response.body.stack)
    }

    return response
  }
}
