import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(username: string, password: string) {
    const users = await this.usersService.find(username);
    if (users.length) {
      throw new BadRequestException('username in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.usersService.create(username, hash);

    // delete user.password; No need to delete password, it's not returned in the response

    return user;
  }

  async signin(username: string, password: string) {
    const [user] = await this.usersService.find(username);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('bad password');
    }

    // delete user.password; No need to delete password, it's not returned in the response

    return user;
  }
}
