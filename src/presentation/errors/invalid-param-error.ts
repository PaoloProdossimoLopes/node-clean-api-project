export class InvalidParamError extends Error {
  constructor (errorMessage: string) {
    super(`Invalid param: ${errorMessage}`)
    this.name = 'InvalidParamError'
  }
}
