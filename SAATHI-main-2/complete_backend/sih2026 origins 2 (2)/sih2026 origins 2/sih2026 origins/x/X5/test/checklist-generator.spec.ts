import { ChecklistGeneratorService } from '../src/checklist-generator.service';

describe('X5: Checklist Generator Service', () => {
  let service: ChecklistGeneratorService;

  beforeEach(() => {
    service = new ChecklistGeneratorService();
  });

  it('should calculate statutory MSME concessions accurately', () => {
    const template = service.findTemplate('IS 10500')!;
    const microFees = service.calculateFees(template, 'MICRO');
    expect(microFees.concessionPercentage).toBe(50);
    expect(microFees.applicationFeeInr).toBe(500);

    const smallFees = service.calculateFees(template, 'SMALL');
    expect(smallFees.concessionPercentage).toBe(20);
    expect(smallFees.applicationFeeInr).toBe(800);
  });

  it('should throw NotFoundException for unsupported standard', () => {
    expect(() => {
      service.generateChecklist({ standardNumberOrProduct: 'IS 999999 Nonexistent' });
    }).toThrow();
  });

  it('should dynamically update progress percentage when items are toggled', () => {
    const checklist = service.generateChecklist({
      standardNumberOrProduct: 'IS 10500',
    });

    const updated = service.toggleItemCompleted(checklist.checklistId, 'DOC-01', true);
    expect(updated?.completedItemsCount).toBe(1);
    expect(updated?.progressPercentage).toBeGreaterThan(0);
  });
});
