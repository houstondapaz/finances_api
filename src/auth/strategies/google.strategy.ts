import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { GoogleConfig } from 'src/shared/config/google.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(googleConfig: GoogleConfig) {
    super({
      clientID: googleConfig.clientId,
      clientSecret: googleConfig.secret,
      callbackURL: googleConfig.callBackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    return {
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`.trimEnd(),
      thumbURL: photos[0].value,
      accessToken,
      refreshToken,
    };
  }
}
