import { Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { ChecklistExporter } from './checklist-exporter';
import { ChecklistGeneratorService } from './checklist-generator.service';

@Module({
  controllers: [ChecklistController],
  providers: [ChecklistGeneratorService, ChecklistExporter],
  exports: [ChecklistGeneratorService, ChecklistExporter],
})
export class ChecklistModule {}
