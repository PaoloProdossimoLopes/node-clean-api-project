import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

describe('BCryptAdapter', () => {
  test('should call bcrypt with correct value', async () => {
    const sut = new BCryptAdapter()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 12)
  })

  test('should return a hash on success', async () => {
    const sut = new BCryptAdapter()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hashed')
  })
})

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hashed'))
  }
}))
