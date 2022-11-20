import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUserDto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    await this.createPassword(createdUser);
    createdUser.save();
  }

  private async createPassword(user: User): Promise<void> {
    const salt = await this.generateSalt();
    const hashPassword = await hash(
      user.password,
      salt + process.env.PEPPER_WORD,
    );

    user.password = hashPassword;
    user.salt = salt;
  }

  private async generateSalt(): Promise<string> {
    const saltRounds = 10;
    return genSalt(saltRounds);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email });
  }
}
