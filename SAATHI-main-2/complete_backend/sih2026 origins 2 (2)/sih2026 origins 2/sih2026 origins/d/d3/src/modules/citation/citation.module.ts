import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentChunk } from './entities/chunk.entity';
import { CitationController } from './citation.controller';
import { CitationService } from './citation.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentChunk])],
  controllers: [CitationController],
  providers: [CitationService],
  exports: [CitationService],
})
export class CitationModule {}
