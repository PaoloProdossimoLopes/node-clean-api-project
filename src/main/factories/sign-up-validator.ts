import { RequiredFieldValidator } from './../../presentation/helpers/required-field-validator'
import { CompareFieldsValidator } from './../../presentation/helpers/compare-validator'
import { EmailValiadtor } from './../../presentation/helpers/email-validator'
import { ValidatorComposite } from './../../presentation/helpers/validator-composite'
import { EmailValiadatorAdapter } from './../../utils/email-validator-adapter'

export const makeCompositeValidator = (): ValidatorComposite => {
  const emailValidator = new EmailValiadatorAdapter()
  const name = 'name'
  const email = 'email'
  const password = 'password'
  const passwordConfirmation = 'passwordConfirmation'
  const validations = [
    new RequiredFieldValidator(name),
    new RequiredFieldValidator(email),
    new RequiredFieldValidator(password),
    new RequiredFieldValidator(passwordConfirmation),
    new EmailValiadtor(emailValidator),
    new CompareFieldsValidator(password, passwordConfirmation)
  ]
  return new ValidatorComposite(validations)
}
