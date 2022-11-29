import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  constructor(private configService: ConfigService) {}

  async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(
      +this.configService.get<string>('SALT_ROUNDS'),
    );
    return bcrypt.hash(data, salt);
  }

  async compareData(plaintextData: string, hashData: string): Promise<Boolean> {
    const isMatch = await bcrypt.compare(plaintextData, hashData);
    return isMatch;
  }
}
