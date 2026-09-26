import { ChecklistExporter } from '../src/checklist-exporter';
import { ChecklistGeneratorService } from '../src/checklist-generator.service';

describe('X5: Checklist Exporter', () => {
  let exporter: ChecklistExporter;
  let service: ChecklistGeneratorService;

  beforeEach(() => {
    exporter = new ChecklistExporter();
    service = new ChecklistGeneratorService();
  });

  it('should export checklist to markdown and printable HTML', () => {
    const checklist = service.generateChecklist({
      standardNumberOrProduct: 'IS 10500',
      enterpriseScale: 'MICRO',
    });

    const md = exporter.exportToMarkdown(checklist);
    expect(md).toContain('# BIS Compliance Action Plan');
    expect(md).toContain('50% Statutory BIS Concession');

    const html = exporter.exportToPrintableHtml(checklist);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Drinking Water');
  });
});
