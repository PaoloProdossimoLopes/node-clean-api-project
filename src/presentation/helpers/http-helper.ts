import { InternalServerError } from '../errors/internal-server-error'
import { HTTPResponse } from '../protocols/http'

export const badRequest = (error: Error): HTTPResponse => ({
  statusCode: 400,
  body: error
})

export const internalServerError = (): HTTPResponse => ({
  statusCode: 500,
  body: new InternalServerError()
})

export const ok = (data: any): HTTPResponse => {
  return {
    statusCode: 200,
    body: data
  }
}
