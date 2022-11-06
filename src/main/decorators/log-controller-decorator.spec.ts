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
})

interface SUT {
  controller: ControllerSpy
  sut: LogControllerDecorator
}

const makeSUT = (): SUT => {
  const controller = new ControllerSpy()
  const sut = new LogControllerDecorator(controller)
  return {
    controller,
    sut
  }
}

const makeHTTPRequest = ((): HTTPRequest => {
  return { body: 'any_body' }
})

class ControllerSpy implements Controller {
  httpRequestRecieveds: HTTPRequest[] = []
  async handle (httpRequest: HTTPRequest): Promise<HTTPResponse> {
    this.httpRequestRecieveds.push(httpRequest)
    return {
      body: 'any_body',
      statusCode: 0
    }
  }
}
