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
    console.log(`Creating new user with email: ${createUserDto.email}`);
    const createdUser = new this.userModel(createUserDto);
    await this.createPassword(createdUser);
    await createdUser.save();
    console.log(`Created user`);
  }

  private async createPassword(user: User): Promise<void> {
    console.log('Hashing password');
    const salt = await this.generateSalt();
    const hashPassword = await hash(
      user.password,
      salt + process.env.PEPPER_WORD,
    );

    user.password = hashPassword;
    user.salt = salt;
  }

  private async generateSalt(): Promise<string> {
    console.log('generating salt text');
    const saltRounds = 10;
    return genSalt(saltRounds);
  }

  async findByEmail(email: string): Promise<User> {
    console.log(`Trying to find an user by email: ${email}`);
    return this.userModel.findOne({ email: email });
  }

  async findById(userId: string): Promise<User> {
    console.log(`Trying to find user by Id: ${userId}`);

    return this.userModel.findById({ _id: userId });
  }
}
