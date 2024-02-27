import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from 'src/utils/constants';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtAuthStrategy.extractJWT]),
      secretOrKey: jwtSecret,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'access-token' in req.cookies) {
      return req.cookies['access-token'];
    }

    return null;
  }

  async validate(payload: { id: string; email: string }) {
    return payload;
  }
}
