import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { ConfigsService, Configs } from 'src/configs/configs.service';

@Injectable()
export class UsersService {
  private readonly config: Configs;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configsService: ConfigsService,
  ) {
    this.config = this.configsService.get();
  }

  create(createUserInput: CreateUserInput) {
    console.log(createUserInput);
    return 'This action adds a new user';
  }

  async findAll() {
    const dbUrl = this.config.DATABASE_URL;
    console.log('db_url', dbUrl);
    const users = await this.userModel.find({});
    console.log(users);
    return [{ exampleField: 1 }];
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    console.log(updateUserInput);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
