import { OfflineBundleBuilder } from '../src/offline-bundle-builder';
import { OfflineSyncService } from '../src/offline-sync.service';

describe('X9: Offline-First PWA Synchronization & Cache Engine (Enhanced)', () => {
  let bundleBuilder: OfflineBundleBuilder;
  let syncService: OfflineSyncService;

  beforeEach(() => {
    bundleBuilder = new OfflineBundleBuilder();
    syncService = new OfflineSyncService(bundleBuilder);
  });

  describe('Offline Bundle & Caching', () => {
    it('should build a complete offline bundle with checksum and inverted index', () => {
      const bundle = bundleBuilder.buildBundle();
      expect(bundle.bundleVersion).toBeDefined();
      expect(bundle.bundleChecksum.length).toBe(64);
    });

    it('should return 304 Not Modified when client ETag matches', () => {
      const initial = syncService.handleSyncRequest({});
      const etag = initial.etag;

      const second = syncService.handleSyncRequest({ ifNoneMatch: etag });
      expect(second.isUpToDate).toBe(true);
      expect(second.bundle).toBeUndefined();
    });
  });

  describe('Offline Query Resolution Engine', () => {
    it('should answer questions directly from offline cache without network', () => {
      const result = syncService.resolveQueryOffline('What is the fee concession for micro scale industries?');
      expect(result).not.toBeNull();
      expect(result?.isOfflineResult).toBe(true);
      expect(result?.answerOrSummary).toContain('50% concession');
    });

    it('should resolve standard scope and clauses offline', () => {
      const result = syncService.resolveQueryOffline('Tell me about drinking water IS 10500 standard');
      expect(result).not.toBeNull();
      expect(result?.standardNumber).toContain('IS 10500');
      expect(result?.clauses?.length).toBeGreaterThan(0);
    });
  });
});
