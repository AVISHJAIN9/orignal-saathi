import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SitemapService } from './sitemap.service';
import { SitemapController } from './sitemap.controller';
import { STANDARDS_PORT } from '../common/ports/standards.port';
import { InMemoryStandardsPort } from './in-memory-standards.port';

@Module({
  imports: [ConfigModule],
  controllers: [SitemapController],
  providers: [
    SitemapService,
    // SWAP-IN POINT: replace with D2's real adapter reading the standards
    // table, e.g.:
    //   { provide: STANDARDS_PORT, useClass: TypeOrmStandardsAdapter }
    { provide: STANDARDS_PORT, useClass: InMemoryStandardsPort },
  ],
})
export class SitemapModule {}
