import { HTTPRequest } from './../../presentation/protocols/http'
import { IController } from './../../presentation/protocols/controller'
import { Request, Response } from 'express'

export const adapetRoute = (controller: IController) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HTTPRequest = {
      body: request.body
    }
    console.log(httpRequest)
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      response
        .status(httpResponse.statusCode)
        .json(httpResponse.body)
    } else {
      response.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
