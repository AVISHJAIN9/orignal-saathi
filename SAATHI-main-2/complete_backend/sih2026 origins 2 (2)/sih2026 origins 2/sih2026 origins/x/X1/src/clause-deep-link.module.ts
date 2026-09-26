import { Module } from '@nestjs/common';
import { ClauseDeepLinkController } from './clause-deep-link.controller';
import { ClauseDeepLinkService } from './clause-deep-link.service';

@Module({
  controllers: [ClauseDeepLinkController],
  providers: [ClauseDeepLinkService],
  exports: [ClauseDeepLinkService],
})
export class ClauseDeepLinkModule {}
