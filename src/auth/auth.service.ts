import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { User } from 'src/users/schemas/user.schema';
import { LoginDto } from './dto/LoginDto';

@Injectable()
export class AuthService {
  async login(login: LoginDto, user: User) {
    const hashedPassword = user.password;
    const isMatch = await compare(login.password, hashedPassword);

    if (!isMatch) {
      throw new Error('Wrong credentials');
    }

    return this.generateAccessToken(user);
  }

  private async generateAccessToken(user: User) {
    const userData = {
      email: user.email,
      name: user.name,
    };

    const accessToken = sign(userData, process.env.SECRET_KEY_JWT, {
      expiresIn: 60,
    });

    return accessToken;
  }

  async authenticateToken(authentication) {
    const token = authentication.split(' ')[1];

    const result = verify(token, process.env.SECRET_KEY_JWT, {
      ignoreExpiration: false,
    });

    console.log({ result });
  }
}
