import { AccountMongoRepository } from './../../infra/db/mongodb/account-repository/account'
import { BCryptAdapter } from './../../infra/cryptography/bcrypt-adapter'
import { DBAddAccount } from './../../data/use-cases/add-account/db-add-account'
import { EmailValiadatorAdapter } from './../../utils/email-validator-adapter'
import { SignUpController } from './../../presentation/controllers/signup'

export const makeSignUpController = (): SignUpController => {
  const repository = new AccountMongoRepository()
  const encrypter = new BCryptAdapter()
  const validator = new EmailValiadatorAdapter()
  const account = new DBAddAccount(encrypter, repository)
  return new SignUpController(validator, account)
}
