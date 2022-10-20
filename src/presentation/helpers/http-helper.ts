import { HTTPResponse } from '../protocols/http'

export const badRequest = ((error: Error): HTTPResponse => {
  return {
    statusCode: 400,
    body: error
  }
})
