import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (username: string) => {
        const filteredUsers = users.filter(
          (user) => user.username === username,
        );
        return Promise.resolve(filteredUsers);
      },
      create: (username: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          username,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a hashed password', async () => {
    const user = await service.signup('rgdlfsfl', 'ass21df');
    expect(user.password).not.toEqual('ass21df');
  });

  it('throws an error if user signs up with username that is in use', async () => {
    await service.signup('rgdlfsffl', 'ass21df');
    await expect(service.signup('rgdlfsffl', 'ass21df')).rejects.toThrow();
  });

  it('throws if signin is called with an unused username', async () => {
    await expect(service.signin('dfv32fe', 'passdflkj')).rejects.toThrow();
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('3refwr32fgfx', 'password');
    await expect(service.signin('3refwr32fgfx', 'laksdlfkj')).rejects.toThrow();
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('fregjio0932', 'mypassword');
    const user = await service.signin('fregjio0932', 'mypassword');
    expect(user).toBeDefined();
  });
});
