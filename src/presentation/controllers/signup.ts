export class SignUpController {
  handle (httpRequest: any): any {

    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: this.makeError('nome')
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: this.makeError('email')
      }
    }
  }

  private makeError (field: string): Error {
    return new Error(`Missing param: ${field}`)
  }
}
