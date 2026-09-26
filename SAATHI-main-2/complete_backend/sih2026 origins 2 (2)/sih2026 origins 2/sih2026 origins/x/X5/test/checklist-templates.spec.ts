import { CHECKLIST_TEMPLATES } from '../src/checklist-templates';

describe('X5: Checklist Templates Library', () => {
  it('should include all required major standards with mandatory clauses', () => {
    expect(CHECKLIST_TEMPLATES['IS 10500']).toBeDefined();
    expect(CHECKLIST_TEMPLATES['IS 456']).toBeDefined();
    expect(CHECKLIST_TEMPLATES['IS 1293']).toBeDefined();
    expect(CHECKLIST_TEMPLATES['IS 9873']).toBeDefined();
    expect(CHECKLIST_TEMPLATES['IS 15844']).toBeDefined();
    expect(CHECKLIST_TEMPLATES['IS 16102']).toBeDefined();

    const toys = CHECKLIST_TEMPLATES['IS 9873'];
    expect(toys.productName).toContain('Toys');
    expect(toys.testingParameters.some((t) => t.id === 'TST-01')).toBe(true);
  });
});
