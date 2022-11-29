import { Controller, Get, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/iam')
  profile(@Request() request) {
    return 'profile';
  }

  @Post('create')
  create() {
    return 'create';
  }
}
