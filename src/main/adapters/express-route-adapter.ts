import { HTTPRequest } from './../../presentation/protocols/http'
import { Controller } from './../../presentation/protocols/controller'
import { Request, Response } from 'express'

export const adapetRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HTTPRequest = {
      body: request.body
    }
    console.log(httpRequest)
    const httpResponse = await controller.handle(httpRequest)
    response
      .status(httpResponse.statusCode)
      .json(httpResponse.body)
  }
}
