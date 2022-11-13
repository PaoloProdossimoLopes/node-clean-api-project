import { HTTPRequest, HTTPResponse } from './http'

export interface IController {
  handle: (httpRequest: HTTPRequest) => Promise<HTTPResponse>
}
