import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService) {}

  async signUp(createUserDto: CreateUserDto) {
    const foundUser = await this.db.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (foundUser) throw new BadRequestException('User already exists');

    createUserDto.password = await this.hashPassword(createUserDto.password);

    await this.db.user.create({ data: { ...createUserDto } });

    return {
      message: 'Sign up was successfull',
      user: { ...createUserDto },
    };
  }

  async signIn(loginDto: LoginDto) {
    const foundUser = await this.db.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!foundUser) throw new BadRequestException('Invalid credentials');

    const isMatch = await this.comparePassword({
      password: loginDto.password,
      hash: foundUser.password,
    });

    if (!isMatch) throw new BadRequestException('Invalid password');

    return { message: 'Sign in was successfull' };
  }

  async signOut() {
    return { message: 'Sign out was successfull' };
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(args: { password: string; hash: string }) {
    return bcrypt.compare(args.password, args.hash);
  }
}
