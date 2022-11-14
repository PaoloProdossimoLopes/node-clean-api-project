import { InternalServerError } from '../errors/internal-server-error'
import { UnauthorizedError } from '../errors/invalid-cerdential-error'
import { HTTPResponse } from '../protocols/http'

// @Failure Factories
export const badRequest = (error: Error): HTTPResponse => ({
  statusCode: kInvalidParamErrorStatusCode,
  body: error
})

export const internalServerError = (error: Error): HTTPResponse => ({
  statusCode: kInternalServerErrorStatusCode,
  body: new InternalServerError(error.stack)
})

export const unauthorizedError = (): HTTPResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
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
