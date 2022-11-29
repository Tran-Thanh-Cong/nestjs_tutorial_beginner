import { Users } from './entities/users.entity';
import { CreateUserDto } from './dto/create-users.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async createUser(data: CreateUserDto): Promise<Users> {
    const { email } = data;
    try {
      const user = await this.usersRepository.findUserByEmail(email);
      if (user) {
        throw new HttpException('User already exists', HttpStatus.FOUND);
      }
      return this.usersRepository.createUser(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }
}
