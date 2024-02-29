import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    return this.db.user.create({ data: createUserDto });
  }

  findAll() {
    return this.db.user.findMany();
  }

  findOne(id: string) {
    return this.db.user.findUniqueOrThrow({ where: { id: id } });
  }

  findUserByEmail(email: string) {
    return this.db.user.findUnique({ where: { email: email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
        updateUserDto.password = hashedPassword;
      }

      return this.db.user.update({
        where: { id: id },
        data: updateUserDto,
      });
    } catch (error) {
      console.log(error);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
