import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.signin(req.user, res);
  }

  // @Post('signup')
  // signUp(@Body() createUserDto: CreateUserDto) {
  //   return this.authService.signUp(createUserDto);
  // }

  @Get('signout')
  signOut(@Req() req: Request, @Res() res: Response) {
    return this.authService.signOut(req, res);
  }
}
