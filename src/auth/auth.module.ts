import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtConfig } from 'src/shared/config/jwt.config';
import { SharedModule } from 'src/shared/shared.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    SharedModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [SharedModule],
      inject: [JwtConfig],
      useFactory: async (jwtConfig: JwtConfig) => ({
        secret: jwtConfig.secret,
        signOptions: {
          expiresIn: jwtConfig.refreshExpirationSeconds,
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, JwtRefreshStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
