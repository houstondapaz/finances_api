import { Module } from '@nestjs/common';
import { JwtConfig } from './config/jwt.config';
import { GoogleConfig } from './config/google.config';
import { DatabaseConfig } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './config/app.config';

@Module({
  imports: [ConfigModule],
  providers: [JwtConfig, GoogleConfig, DatabaseConfig, AppConfig],
  exports: [JwtConfig, GoogleConfig, DatabaseConfig, AppConfig],
})
export class SharedModule {}
