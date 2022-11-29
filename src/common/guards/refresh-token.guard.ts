import { AuthGuard } from '@nestjs/passport';
import { Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class RefreshTokenGuard
  extends AuthGuard('jwt-refresh-token')
  implements CanActivate
{
  constructor() {
    super();
  }
}
