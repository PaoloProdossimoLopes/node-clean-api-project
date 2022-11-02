import bcrypt from 'bcrypt'
import { IEncrypter } from '@/data/protocols/encrypt'

export class BCryptAdapter implements IEncrypter {
  async encrypt (value: string): Promise<string> {
    const salt = 12
    const hashed = await bcrypt.hash(value, salt)
    return hashed
  }
}
