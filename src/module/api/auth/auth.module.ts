import { Module, CacheModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { BcryptService } from '../../../common/bcrypt/bcrypt.service';
import * as redisStore from 'cache-manager-redis-store';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost', //default host
      port: 6379, //default port
    }),
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BcryptService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class AuthModule {}
