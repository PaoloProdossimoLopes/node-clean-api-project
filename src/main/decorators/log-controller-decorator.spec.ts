import { InternalServerError } from './../../presentation/errors/internal-server-error'
import { ILogger } from './../../presentation/protocols/logger'
import { LogControllerDecorator } from './log-controller-decorator'
import { HTTPRequest, HTTPResponse } from '@/presentation/protocols'
import { Controller } from './../../presentation/protocols/controller'

describe('LogControllerDecorator', () => {
  test('should call handle method', async () => {
    const { controller, sut } = makeSUT()
    const epxected = makeHTTPRequest()

    await sut.handle(epxected)

    expect(controller.httpRequestRecieveds.length).toBe(1)
    expect(controller.httpRequestRecieveds).toEqual([epxected])
  })

  test('should returns same value as internal conrtoller pass', async () => {
    const { sut } = makeSUT()
    const epxected = makeHTTPRequest()

    const recieved = await sut.handle(epxected)
    expect(recieved).toEqual({
      body: 'any_body',
      statusCode: 0
    })
  })

  test('should call `LogErrorRepository` with correct error if controller retrusn a server error', async () => {
    const { sut, controller, repository } = makeSUT()
    controller.statusCodeExpected = 500
    controller.errorExpecetd = new InternalServerError('any_message')
    const epxected = makeHTTPRequest()
    await sut.handle(epxected)
    expect(repository.messageRecieveds.length).toEqual(1)
    expect(repository.messageRecieveds).toEqual(['any_message'])
  })
})

// @Helpers
interface SUT {
  controller: ControllerSpy
  repository: LogErrorRepositorySPY
  sut: LogControllerDecorator
}

const makeSUT = (): SUT => {
  const controller = new ControllerSpy()
  const repository = new LogErrorRepositorySPY()
  const sut = new LogControllerDecorator(controller, repository)
  return { controller, repository, sut }
}

const makeHTTPRequest = ((): HTTPRequest => {
  return { body: 'any_body' }
})

// @Test Doubles
class ControllerSpy implements Controller {
  httpRequestRecieveds: HTTPRequest[] = []
  errorExpecetd?: Error
  statusCodeExpected: number = 0

  async handle (httpRequest: HTTPRequest): Promise<HTTPResponse> {
    this.httpRequestRecieveds.push(httpRequest)
    let bodyHandled: any = 0
    if (this.errorExpecetd) {
      bodyHandled = this.errorExpecetd
    } else {
      bodyHandled = 'any_body'
    }
    return {
      body: bodyHandled,
      statusCode: this.statusCodeExpected
    }
  }
}

class LogErrorRepositorySPY implements ILogger {
  messageRecieveds: string[] = []

  log (message: string): void {
    this.messageRecieveds.push(message)
  }
}
