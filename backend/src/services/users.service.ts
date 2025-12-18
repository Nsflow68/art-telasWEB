import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    // Ensure the schema exists
    await this.dataSource.query('CREATE SCHEMA IF NOT EXISTS "artelas"');
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  create(user: Partial<User>): Promise<User> {
    return this.usersRepository.save(user);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, user);
    return await this.usersRepository.findOneByOrFail({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
