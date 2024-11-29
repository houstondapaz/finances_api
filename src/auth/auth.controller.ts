import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { CurrentUser, LoggedUser } from 'src/shared/context';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from 'src/shared/config/jwt.config';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtConfig: JwtConfig,
  ) {}

  setCookieTokens(tokens: { accessToken; refreshToken }, response: Response) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        Number.parseInt(this.jwtConfig.expirationSeconds) * 1000,
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getTime() +
        Number.parseInt(this.jwtConfig.refreshExpirationSeconds) * 1000,
    );

    const secure = this.configService.get('NODE_ENV') === 'production';
    response.cookie('Authentication', tokens.accessToken, {
      httpOnly: true,
      secure,
      expires: expiresAccessToken,
    });

    response.cookie('Refresh', tokens.refreshToken, {
      httpOnly: true,
      secure,
      expires: expiresRefreshToken,
    });
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(
    @CurrentUser() user: LoggedUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.loginById(user.id);
    this.setCookieTokens(tokens, response);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  loginGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleCallback(
    @CurrentUser() user: LoggedUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.loginByEmail(user.email);

    await this.usersService.update(tokens.user.id, {
      name: user.name,
      thumbURL: user.thumbURL,
    });
    this.setCookieTokens(tokens, response);
  }
}
