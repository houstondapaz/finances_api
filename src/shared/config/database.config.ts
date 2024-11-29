import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parse, ConnectionOptions } from 'pg-connection-string';

@Injectable()
export class DatabaseConfig {
  private readonly databaseURL: ConnectionOptions;
  constructor(private readonly configService: ConfigService) {
    this.databaseURL = parse(configService.getOrThrow('DATABASE_URL'));
  }

  get host() {
    return this.databaseURL.host;
  }

  get port() {
    return Number.parseInt(this.databaseURL.port);
  }

  get username() {
    return this.databaseURL.user;
  }

  get password() {
    return this.databaseURL.password;
  }

  get database() {
    return this.databaseURL.database;
  }

  get ssl() {
    if (this.databaseURL.ssl) {
      return {
        rejectUnauthorized: false,
      };
    }

    return false;
  }

  get migrationsRun() {
    return this.configService.get('RUN_MIGRATIONS');
  }

  get logging() {
    return process.env.NODE_ENV !== 'production';
  }
}
