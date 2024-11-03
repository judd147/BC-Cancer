import { User } from '@bc-cancer/shared/src/types';
import { Expose } from 'class-transformer';

export class UserDto implements User {
  @Expose()
  id: number;

  @Expose()
  username: string;
}
