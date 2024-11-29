import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfig {
  constructor(private readonly configService: ConfigService) {}

  get secret() {
    return this.configService.getOrThrow('JWT_SECRET');
  }

  get expirationSeconds() {
    return this.configService.getOrThrow('JWT_EXPIRATION_SECONDS');
  }
  get refreshSecret() {
    return this.configService.getOrThrow('JWT_REFRESH_SECRET');
  }

  get refreshExpirationSeconds() {
    return this.configService.getOrThrow('JWT_REFRESH_EXPIRATION_SECONDS');
  }
}
