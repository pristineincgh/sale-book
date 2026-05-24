import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(body: LoginDto) {
    const user = await this.usersService.findByFullNameWithPin(body.name);

    if (!user) {
      throw new UnauthorizedException('Invalid login details');
    }

    const isPinValid = await bcrypt.compare(body.pin, user.pinHash);

    if (!isPinValid) {
      throw new UnauthorizedException('Invalid login details');
    }

    const payload = {
      sub: user.id,
      fullName: user.name,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        fullName: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
