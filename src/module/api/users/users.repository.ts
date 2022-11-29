import { CreateUserDto } from './dto/create-users.dto';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  private readonly usersRepository: Repository<Users>;
  constructor(@InjectRepository(Users) usersRepository: Repository<Users>) {
    this.usersRepository = usersRepository;
  }

  async createUser(data: CreateUserDto): Promise<Users> {
    const { username, email, password } = data;
    const user = this.usersRepository.create({
      username: username,
      email: email,
      password: password,
    });
    await this.usersRepository.save(user);
    return user;
  }

  findUserByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOne({
      select: ['id', 'username', 'email', 'password', 'isVerify'],
      where: {
        email: email,
      },
    });
  }

  findUserById(id: number): Promise<Users> {
    return this.usersRepository.findOne({
      select: ['id', 'username', 'email', 'isVerify'],
      where: {
        id: id,
      },
    });
  }
}
