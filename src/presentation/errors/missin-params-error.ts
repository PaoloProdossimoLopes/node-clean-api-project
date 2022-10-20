export class MissinParamsError extends Error {
  constructor (paramName: string) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissinParamsError'
  }
}
