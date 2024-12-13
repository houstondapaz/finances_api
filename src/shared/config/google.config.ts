import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app.config';

@Injectable()
export class GoogleConfig {
  constructor(
    private readonly configService: ConfigService,
    private readonly appService: AppConfig,
  ) {}

  get clientId() {
    return this.configService.getOrThrow('GOOGLE_CLIENT_ID');
  }

  get secret() {
    return this.configService.getOrThrow('GOOGLE_SECRET');
  }

  get callBackURL() {
    return `${this.appService.host}/auth/google/callback`;
  }
}
