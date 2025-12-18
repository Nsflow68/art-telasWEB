import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const { email, rut } = createUserDto;

    // Check if user exists
    const existing = await this.usersRepository.findOne({
      where: [{ email }, { rut }],
    });

    if (existing) {
      throw new ConflictException('User with this Email or RUT already exists');
    }

    const newUser = this.usersRepository.create(createUserDto);

    // Auto-assign admin role for testing purposes if email is from duocuc.cl
    if (email.endsWith('@duocuc.cl')) {
      newUser.role = 'admin';
    }

    await this.usersRepository.save(newUser);

    const { password, ...result } = newUser;
    return result;
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !(await user.checkPassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return {
      message: 'Login successful',
      user: result,
      // Here usually you return a JWT token
      token: 'mock-jwt-token-for-' + user.id,
    };
  }
}
