import { Module } from '@nestjs/common';
import { TwoFactorService } from './two-factor.service';
import { TwoFactorController } from './two-factor.controller';
import { TWO_FACTOR_PORT } from '../common/ports/two-factor.port';
import { InMemoryTwoFactorPort } from './in-memory-two-factor.port';

@Module({
  controllers: [TwoFactorController],
  providers: [
    TwoFactorService,
    // SWAP-IN POINT: replace with P1's real adapter writing to the admin
    // credentials table's 2FA columns, e.g.:
    //   { provide: TWO_FACTOR_PORT, useClass: TypeOrmTwoFactorAdapter }
    { provide: TWO_FACTOR_PORT, useClass: InMemoryTwoFactorPort },
  ],
  // Exported so P1's AuthModule can inject TwoFactorService and call
  // verifyLoginCode() as the second step of the login flow.
  exports: [TwoFactorService],
})
export class TwoFactorModule {}
