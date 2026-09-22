import {
  Injectable
} from '@nestjs/common';
import {
  AuthGuard
} from '@nestjs/passport';

// Thin wrapper around P1 jwt passport strategy
@Injectable(
)
export class JwtAuthGuard extends AuthGuard(
  'jwt'
) {

}
