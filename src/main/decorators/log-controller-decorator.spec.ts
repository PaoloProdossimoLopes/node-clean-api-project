import { LogControllerDecorator } from './log-controller-decorator'
import { HTTPRequest, HTTPResponse } from '@/presentation/protocols'
import { Controller } from './../../presentation/protocols/controller'
describe('LogControllerDecorator', () => {
  test('should call handle method', async () => {
    const controller = new ControllerSpy()
    const sut = new LogControllerDecorator(controller)
    const epxected = makeHTTPRequest()

    await sut.handle(epxected)

    expect(controller.httpRequestRecieveds.length).toBe(1)
    expect(controller.httpRequestRecieveds).toEqual([epxected])
  })
})

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
