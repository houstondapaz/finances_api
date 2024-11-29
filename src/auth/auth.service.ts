import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from 'src/shared/config/jwt.config';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private jwtConfig: JwtConfig,
  ) {}

  private generateTokens(user: User) {
    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
      thumbURL: user.thumbURL,
    });

    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        secret: this.jwtConfig.refreshSecret,
        expiresIn: this.jwtConfig.refreshExpirationSeconds,
      },
    );

    return { accessToken, refreshToken };
  }

  async loginById(id: string) {
    const user = await this.userService.findByEmail(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.generateTokens(user);
  }

  async loginByEmail(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.generateTokens(user);
  }
}
