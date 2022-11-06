export class InternalServerError extends Error {
  constructor (error?: string) {
    super('Ocorreu um erro, tente novamente mais tarde')
    this.name = 'InternalServerError'
    this.stack = error
  }
}
