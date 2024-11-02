export interface User {
  id: number;
  username: string;
}

// Used for creating and signing in a user
export interface CreateUserDto {
  // length: 6-20
  username: string;
  // length: 6-20
  password: string;
}
