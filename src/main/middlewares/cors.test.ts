import request from 'supertest'
import app from '../config/app'

describe('CORSMiddleware', () => {
  describe('CORS', () => {
    test('should enable access control origin', async () => {
      app.get('/test_cors', (request, response) => {
        response.send()
      })

      await request(app)
        .get('/test_cors')
        .expect('access-control-allow-origin', '*')
    })

    test('should enable access control methods', async () => {
      app.get('/test_cors', (request, response) => {
        response.send()
      })

      await request(app)
        .get('/test_cors')
        .expect('access-control-allow-methods', '*')
    })

    test('should enable access control headers', async () => {
      app.get('/test_cors', (request, response) => {
        response.send()
      })

      await request(app)
        .get('/test_cors')
        .expect('access-control-allow-headers', '*')
    })
  })
})
