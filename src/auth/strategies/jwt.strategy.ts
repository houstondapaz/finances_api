import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfig } from 'src/shared/config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(jwtConfig: JwtConfig) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['access_token'];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      ignoreExpiration: false,
      jwtFromRequest: extractJwtFromCookie,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: {
    id: string;
    thumbURL?: string;
    sub?: string;
    email: string;
  }) {
    return {
      id: payload.sub || payload.id,
      thumbURL: payload.thumbURL,
      email: payload.email,
    };
  }
}
