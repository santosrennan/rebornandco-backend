import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

export interface IHashService {
  hash(password: string): Promise<string>
  compare(password: string, hash: string): Promise<boolean>
}

@Injectable()
export class BcryptAdapter implements IHashService {
  private readonly saltRounds = 12

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
