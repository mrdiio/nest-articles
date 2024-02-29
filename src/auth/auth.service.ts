import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) return null;

    const isMatch = await this.comparePassword({
      password,
      hash: user.password,
    });

    if (!isMatch) return null;

    return user;
  }

  async signin(user: any, res: Response) {
    const payload = { name: user.name, sub: user.id };

    const token = await this.jwtService.signAsync(payload);

    if (!token) throw new ForbiddenException('Token was not generated');

    res.cookie('access-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return {
      message: 'Sign in was successfull',
    };
  }

  // async signUp(createUserDto: CreateUserDto) {
  //   const foundUser = await this.db.user.findUnique({
  //     where: { email: createUserDto.email },
  //   });

  //   if (foundUser) throw new BadRequestException('User already exists');

  //   createUserDto.password = await this.hashPassword(createUserDto.password);

  //   await this.db.user.create({ data: { ...createUserDto } });

  //   return {
  //     message: 'Sign up was successfull',
  //     user: { ...createUserDto },
  //   };
  // }

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
}
