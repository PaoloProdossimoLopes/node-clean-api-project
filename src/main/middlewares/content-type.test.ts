import request from 'supertest'
import app from '../config/app'

describe('ContentTypeMiddleware', () => {
  test('should return default content type as json', async () => {
    app.get('/test_content_type', (request, response) => {
      response.send()
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
})
