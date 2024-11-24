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

/**
 * Parameters for querying users.
 *
 * @interface FindUsersDto
 * @property {string} [username] - Filter by username using a case-insensitive partial match. If not provided, all users are returned.
 * @property {number} [page] - The page number for pagination. Defaults to 1.
 * @property {number} [limit] - The number of items per page. Defaults to 20.
 */
export interface FindUsersDto {
  username?: string;
  page?: number;
  limit?: number;
}
