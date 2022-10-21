export class InternalServerError extends Error {
  constructor () {
    super('Ocorreu um erro, tente novamente mais tarde')
    this.name = 'InternalServerError'
  }
}
