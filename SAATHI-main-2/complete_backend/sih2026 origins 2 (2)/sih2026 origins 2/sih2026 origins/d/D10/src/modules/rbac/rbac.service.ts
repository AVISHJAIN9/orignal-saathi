import { Injectable } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RbacService {
  constructor(private readonly usersService: UsersService) {}

  assignRole(userId: string, role: Role): Promise<User> {
    return this.usersService.setRole(userId, role);
  }
}
