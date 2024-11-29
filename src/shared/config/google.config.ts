import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleConfig {
  constructor(private readonly configService: ConfigService) {}

  get clientId() {
    return this.configService.getOrThrow('GOOGLE_CLIENT_ID');
  }

  get secret() {
    return this.configService.getOrThrow('GOOGLE_SECRET');
  }

  get callBackURL() {
    return `${this.configService.getOrThrow('HOST')}/auth/google/callback`;
  }
}
