import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  constructor(private readonly configService: ConfigService) {}

  get host() {
    return this.configService.getOrThrow('HOST');
  }

  get clientHost() {
    return this.configService.getOrThrow('CLIENT_HOST');
  }

  get isProduction() {
    return this.configService.get('NODE_ENV') === 'production';
  }
}
