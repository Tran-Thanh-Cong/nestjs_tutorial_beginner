import { RefreshTokenGuard } from './../../../common/guards/refresh-token.guard';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './../users/dto/create-users.dto';
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from '../../../common/decorator/current-user.decorator';
import { AccessTokenGuard } from '../../../common/guards/access-token.guard';
import { Public } from '../../../common/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  @Public()
  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('generate-new-access-token')
  generateNewAccessToken(
    @CurrentUser('id') user_id: number,
    @CurrentUser('refresh_token') refresh_token: string,
  ) {
    return this.authService.generateAccessToken(user_id, refresh_token);
  }
}
