import { Body, Controller, Get, Header, Param, Patch, Post, Query } from '@nestjs/common';
import { ChecklistExporter } from './checklist-exporter';
import { ChecklistGeneratorService } from './checklist-generator.service';
import { GenerateChecklistDto } from './checklist.types';

@Controller('checklists')
export class ChecklistController {
  constructor(
    private readonly generatorService: ChecklistGeneratorService,
    private readonly exporter: ChecklistExporter
  ) {}

  @Post('generate')
  public generateChecklist(@Body() dto: GenerateChecklistDto) {
    return this.generatorService.generateChecklist(dto);
  }

  @Get(':id')
  public getChecklist(@Param('id') id: string) {
    return this.generatorService.getChecklistById(id);
  }

  @Patch(':id/toggle-item')
  public toggleItem(
    @Param('id') id: string,
    @Body('itemId') itemId: string,
    @Body('completed') completed: boolean
  ) {
    return this.generatorService.toggleItemCompleted(id, itemId, completed);
  }

  @Get(':id/export/markdown')
  @Header('Content-Type', 'text/markdown')
  public exportMarkdown(@Param('id') id: string) {
    const checklist = this.generatorService.getChecklistById(id);
    if (!checklist) return 'Checklist not found';
    return this.exporter.exportToMarkdown(checklist);
  }

  @Get(':id/export/printable-html')
  @Header('Content-Type', 'text/html')
  public exportPrintable(@Param('id') id: string) {
    const checklist = this.generatorService.getChecklistById(id);
    if (!checklist) return '<p>Checklist not found</p>';
    return this.exporter.exportToPrintableHtml(checklist);
  }
}
