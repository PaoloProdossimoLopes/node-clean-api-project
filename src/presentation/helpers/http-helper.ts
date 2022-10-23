import { InternalServerError } from '../errors/internal-server-error'
import { HTTPResponse } from '../protocols/http'

// @Failure Factories
export const badRequest = (error: Error): HTTPResponse => ({
  statusCode: kInvalidParamErrorStatusCode,
  body: error
})

export const internalServerError = (): HTTPResponse => ({
  statusCode: kInternalServerErrorStatusCode,
  body: new InternalServerError()
})

// @Success factories
export const ok = (data: any): HTTPResponse => {
  return {
    statusCode: kOkStatusCode,
    body: data
  }
}

// @Constants
const kInvalidParamErrorStatusCode = 400
const kInternalServerErrorStatusCode = 500
const kOkStatusCode = 200
