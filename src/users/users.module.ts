import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtAuthStrategy } from 'src/auth/auth.strategy';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtAuthStrategy],
})
export class UsersModule {}
