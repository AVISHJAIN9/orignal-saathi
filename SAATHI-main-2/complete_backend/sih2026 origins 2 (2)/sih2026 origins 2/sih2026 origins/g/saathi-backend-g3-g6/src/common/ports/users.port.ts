// User record shape for credential lookup
export interface UserRecord {

  id: string;
  email: string;

}

// Decoupled port for user lookup and password updates
export interface UsersPort {

  findByEmail(
    emailAddressString: string
  ): Promise<
    UserRecord | null
  >;

  findById(
    userIdString: string
  ): Promise<
    UserRecord | null
  >;

  updatePasswordHash(
    userIdString: string,
    newPasswordHashString: string
  ): Promise<
    void
  >;

}

export const USERS_PORT = Symbol(
  'USERS_PORT'
);
