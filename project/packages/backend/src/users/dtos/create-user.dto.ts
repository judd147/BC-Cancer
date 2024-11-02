import { CreateUserDto as CreateUser } from '@bc-cancer/shared/src/types';
import { IsString, Length } from 'class-validator';

export class CreateUserDto implements CreateUser {
  @IsString()
  @Length(6, 20)
  username: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
