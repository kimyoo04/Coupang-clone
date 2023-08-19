import { User } from '@/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './enum/user.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(name: string, email: string, password: string) {
    const user = this.userRepository.create({
      name,
      email,
      password,
      emailVerified: false,
    });
    await this.userRepository.save(user);
    return user;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async checkUserIsAdmin(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user.role === Role.Admin;
  }
}
