export interface IValidator {
  validate: (body: any) => Promise<Error>
}
