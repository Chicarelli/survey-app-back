import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { User } from 'src/users/schemas/user.schema';
import { LoginDto } from './dto/LoginDto';

@Injectable()
export class AuthService {
  async login(login: LoginDto, user: User) {
    console.log(`Validating the access of user: ${login.email}`);
    const hashedPassword = user.password;
    const isMatch = await compare(login.password, hashedPassword);

    if (!isMatch) {
      console.error(`Wrong credentials from user ${login.email}`);
      throw new Error('Wrong credentials');
    }

    return this.generateAccessToken(user);
  }

  private async generateAccessToken(user: User) {
    console.log(`Generating access token of user: ${user.email}`);
    const userData = {
      email: user.email,
      name: user.name,
    };

    const accessToken = sign(userData, process.env.SECRET_KEY_JWT, {
      expiresIn: 60 * 60, // 1 HOUR
    });

    return accessToken;
  }
}
