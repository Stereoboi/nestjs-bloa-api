import * as bcrypt from 'bcrypt';

import { HashingProvider } from './hashing.provider.ts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    //generate a aslt
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }
  comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
