import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Thin wrapper around P1's 'jwt' passport strategy.
 *
 * INTEGRATION NOTE: this assumes P1 has already registered a Passport
 * strategy named 'jwt' (via PassportStrategy(Strategy, 'jwt')) that
 * validates the session cookie / bearer token and returns a CurrentUser.
 * If P1's strategy is named differently, change the string below —
 * nothing else in this module needs to change.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
