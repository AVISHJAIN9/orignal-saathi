import { DocumentLifecycleManager } from '../src/document-lifecycle.manager';

describe('X4: Document Lifecycle Manager', () => {
  let manager: DocumentLifecycleManager;

  beforeEach(() => {
    manager = new DocumentLifecycleManager();
  });

  it('should initialize active standard versions and retrieve active edition', () => {
    const active = manager.getActiveVersion('IS 10500');
    expect(active).not.toBeNull();
    expect(active?.status).toBe('ACTIVE');
    expect(active?.standardNumber).toBe('IS 10500:2012');
  });

  it('should transition previous version to SUPERSEDED upon new circular ingestion', () => {
    const active = manager.getActiveVersion('IS 10500')!;
    const circular: any = {
      circularId: 'CIRC-TEST-01',
      affectedStandardNumber: 'IS 10500:2012',
      publishedDate: '2026-06-01',
      amendedClauses: [
        { clauseNumber: '4.2', title: 'TDS Limits', newContent: 'Updated TDS 450 mg/l.' },
      ],
    };

    const newVersion = manager.createNewVersion(active, circular);
    expect(newVersion.status).toBe('ACTIVE');

    const history = manager.getVersionHistory('IS 10500');
    expect(history.length).toBe(2);
    expect(history.some((d) => d.status === 'SUPERSEDED')).toBe(true);
    expect(history.some((d) => d.status === 'ACTIVE')).toBe(true);
  });
});
