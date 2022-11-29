import { ConfigService } from '@nestjs/config';
import { UserRepository } from './../users/users.repository';
import { LoginDto } from './dto/login.dto';
import { Users } from './../users/entities/users.entity';
import { CreateUserDto } from './../users/dto/create-users.dto';
import {
  Injectable,
  HttpException,
  HttpStatus,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { BcryptService } from '../../../common/bcrypt/bcrypt.service';
import { v4 as uuid } from 'uuid';
import { Cache } from 'cache-manager';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly brcyptService: BcryptService,
    private readonly userService: UsersService,
    private readonly userRepository: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(data: CreateUserDto): Promise<Users> {
    try {
      const dataLogin = Object.assign(data, {
        password: await this.brcyptService.hashData(data.password),
      });
      const user = this.userService.createUser(dataLogin);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(data: LoginDto): Promise<Tokens> {
    const { email, password } = data;
    try {
      const user = await this.userRepository.findUserByEmail(email);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (
        (await this.brcyptService.compareData(password, user.password)) ===
        false
      ) {
        throw new HttpException('Password not match', HttpStatus.BAD_REQUEST);
      }

      const [access_token, refresh_token] = await Promise.all([
        // generate access_token
        this.jwtService.signAsync(
          {
            id: user.id,
            username: user.username,
            email: user.email,
          },
          {
            secret: this.configService.get<string>(
              process.env.SECRET_ACCESS_TOKEN,
            ),
            expiresIn: 60 * 15, //15'
          },
        ),

        // refresh_token
        this.jwtService.signAsync(
          {
            id: user.id,
            sub: uuid(),
          },
          {
            secret: this.configService.get<string>(
              process.env.SECRET_REFRESH_TOKEN,
            ),
            expiresIn: 60 * 60 * 24, // 1day
          },
        ),
      ]);

      //store refresh_token in redis
      await this.cacheManager.set(`refresh_token:${user.id}`, refresh_token, {
        ttl: 60 * 60 * 24,
      });

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //generate new access_token
  async generateAccessToken(user_id: number, refreshToken: string) {
    const refresh_token = await this.cacheManager.get(
      `refresh_token:${user_id}`,
    );

    if (!refresh_token) {
      throw new HttpException('Refresh token invalid', HttpStatus.FORBIDDEN);
    }

    if (refreshToken !== refresh_token) {
      throw new HttpException(
        'Refresh token not correct',
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.userRepository.findUserById(user_id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const access_token = await this.jwtService.signAsync(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      {
        secret: this.configService.get<string>(process.env.SECRET_ACCESS_TOKEN),
        expiresIn: 60 * 15, //15'
      },
    );

    return access_token;
  }
}
