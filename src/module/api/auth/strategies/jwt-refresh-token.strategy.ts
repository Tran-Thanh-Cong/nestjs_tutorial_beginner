import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  Injectable,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(process.env.SECRET_REFRESH_TOKEN),
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: any) {
    const data = request?.get('authorization');
    if (!data) {
      throw new ForbiddenException();
    }

    if (data.startsWith('Bearer', 0) === false) {
      throw new HttpException(
        'Refresh_token must start with Bearer',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (data.split(' ').length !== 2) {
      throw new HttpException(
        'Malformed refresh_token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      id: payload.id,
      refresh_token: data.split(' ')[1],
    };
  }
}
