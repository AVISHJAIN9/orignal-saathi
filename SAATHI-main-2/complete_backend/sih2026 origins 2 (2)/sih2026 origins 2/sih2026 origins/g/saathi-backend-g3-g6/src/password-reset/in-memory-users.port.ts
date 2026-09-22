import {
  Injectable
} from '@nestjs/common';
import {
  UserRecord,
  UsersPort
} from '../common/ports/users.port';

// Standalone in-memory implementation of UsersPort for decoupled execution
@Injectable(
)
export class InMemoryUsersPort implements UsersPort {

  private readonly usersMap = new Map<
    string,
    UserRecord
  >(
  );

  async findByEmail(
    emailAddressString: string
  ): Promise<
    UserRecord | null
  > {

    const matchingUser = [
      ...this.usersMap.values(
      )
    ].find(
      (
        userRecord
      ) => userRecord.email === emailAddressString
    );

    return matchingUser ?? null;

  }

  async findById(
    userIdString: string
  ): Promise<
    UserRecord | null
  > {

    return this.usersMap.get(
      userIdString
    ) ?? null;

  }

  async updatePasswordHash(
    _userIdString: string,
    _newPasswordHashString: string
  ): Promise<
    void
  > {

    // In-memory placeholder no-op

  }

}
