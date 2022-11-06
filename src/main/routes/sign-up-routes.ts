import { makeSignUpController } from './../factories/signup'
import { adapetRoute } from './../adapters/express-route-adapter'
import { Router } from 'express'

export default (router: Router): void => {
  const controller = makeSignUpController()
  router.post('/signup', adapetRoute(controller))
}
