import {
  Role
} from './role.enum';

// Shape attached to request.user by JWT authentication
export interface CurrentUser {

  id: string;
  email: string;
  role: Role;

}
