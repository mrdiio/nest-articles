import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
  ) {}

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

  async signIn(loginDto: LoginDto, req: Request, res: Response) {
    const foundUser = await this.db.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!foundUser) throw new BadRequestException('Invalid credentials');

    const isMatch = await this.comparePassword({
      password: loginDto.password,
      hash: foundUser.password,
    });

    if (!isMatch) throw new BadRequestException('Invalid password');

    const token = await this.signToken({
      id: foundUser.id,
      email: foundUser.email,
    });

    if (!token) throw new ForbiddenException();

    res.cookie('access-token', token);

    return res.send({
      message: 'Sign in was successfull',
    });
  }

  async signOut(req: Request, res: Response) {
    res.clearCookie('access-token');
    return res.send({
      message: 'Sign out success',
    });
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(args: { password: string; hash: string }) {
    return bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { id: string; email: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, {
      secret: jwtSecret,
    });
  }
}
