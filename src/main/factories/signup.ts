import { makeCompositeValidator } from './sign-up-validator';
import { MongoLogResponsitory } from './../../infra/db/mongodb/logger-repository'
import { IController } from './../../presentation/protocols/controller'
import { AccountMongoRepository } from './../../infra/db/mongodb/account-repository/account'
import { BCryptAdapter } from './../../infra/cryptography/bcrypt-adapter'
import { DBAddAccount } from './../../data/use-cases/add-account/db-add-account'
import { EmailValiadatorAdapter } from './../../utils/email-validator-adapter'
import { SignUpController } from './../../presentation/controllers/signup/signup'
import { LogControllerDecorator } from '../decorators/log-controller-decorator'

export const makeSignUpController = (): IController => {
  const repository = new AccountMongoRepository()
  const encrypter = new BCryptAdapter()
  const account = new DBAddAccount(encrypter, repository)
  const validator = makeCompositeValidator()
  const controller = new SignUpController(account, validator)
  const loggerRepository = new MongoLogResponsitory()
  const logDecorator = new LogControllerDecorator(controller, loggerRepository)
  return logDecorator
}
