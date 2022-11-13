import { ILogger } from '../../data/protocols/logger'
import { IController } from './../../presentation/protocols/controller'
import { HTTPRequest, HTTPResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements IController {
  private readonly controller: IController
  private readonly repository: ILogger

  constructor (controller: IController, repository: ILogger) {
    this.controller = controller
    this.repository = repository
  }

  async handle (httpRequest: HTTPRequest): Promise<HTTPResponse> {
    const response = await this.controller.handle(httpRequest)

    if (response.statusCode === 500) {
      await this.repository.logError(response.body.stack)
    }

    return response
  }
}
