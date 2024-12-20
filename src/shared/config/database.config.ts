import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  constructor(private readonly configService: ConfigService) {}

  get connectionString() {
    return this.configService.getOrThrow('DATABASE_URL');
  }
}
