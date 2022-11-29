import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './module/api/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { Users } from './module/api/users/entities/users.entity';
import { AuthModule } from './module/api/auth/auth.module';
import { BcryptService } from './common/bcrypt/bcrypt.service';
import * as redisStore from 'cache-manager-redis-store';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards';

@Module({
  imports: [
    //use .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    //config redis
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: '6379',
    }),

    //config mysql
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '060500',
      database: 'mydb',
      entities: [Users],
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BcryptService,

    //use global jwt access_token
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
