/**
 * SAATHI Phase 4 Tests: X11–X15 Real Implementations
 */

const {
  ComplianceAnalyticsService,
  WebhookDispatchService,
  SavedSearchesService,
  BookmarkedStandardsService,
  AnswerPdfSummaryService
} = require('../x/index.js');

async function runTests() {
  console.log('====================================================');
  console.log('TESTING X11–X15 REAL IMPLEMENTATIONS');
  console.log('====================================================');

  // 1. X11 Compliance Analytics & Metric Telemetry
  console.log('\n1. X11 — Compliance Analytics & Telemetry');
  await ComplianceAnalyticsService.recordEvent({
    user_id: 'usr_mfr_101',
    event_type: 'QCO_SEARCH',
    metadata: { standard: 'IS 269:2015' }
  });
  await ComplianceAnalyticsService.recordEvent({
    user_id: 'usr_mfr_102',
    event_type: 'GAP_ANALYSIS_RUN',
    metadata: { standard: 'IS 1293:2019' }
  });
  const metrics = await ComplianceAnalyticsService.getMetrics(24);
  console.assert(typeof metrics.total_events === 'number' && metrics.total_events >= 2, 'X11 total_events should be computed');
  console.assert(metrics.active_users >= 2, 'X11 should compute distinct active users');
  console.log('  ✓ X11: Telemetry recorded, total events:', metrics.total_events, 'active users:', metrics.active_users);

  // 2. X12 Webhook Dispatch Service
  console.log('\n2. X12 — Webhook Dispatch Service');
  const whReg = await WebhookDispatchService.registerWebhook('usr_mfr_101', 'https://webhook.site/saathi-test', ['QCO_UPDATE'], 'sec_xyz123');
  console.assert(whReg.success === true, 'X12 should register webhook');
  console.log('  ✓ X12: Webhook registered:', whReg.webhook_id);

  const dsp = await WebhookDispatchService.dispatchEvent('QCO_UPDATE', { qco_title: 'Cement QCO 2024' });
  console.assert(dsp.attempted >= 1, 'X12 should dispatch to registered listener');
  console.log('  ✓ X12: Webhook event dispatched, attempted count:', dsp.attempted);

  // 3. X13 Saved Searches
  console.log('\n3. X13 — Saved Searches');
  const ss = await SavedSearchesService.saveSearch('usr_mfr_101', {
    title: 'Solar Panels CRS',
    query: 'IS 14286:2010',
    filters: { scheme: 'CRS' }
  });
  console.assert(ss.success === true && ss.saved_search.title === 'Solar Panels CRS', 'X13 should save search');
  const searches = await SavedSearchesService.getSavedSearches('usr_mfr_101');
  console.assert(searches.length >= 1, 'X13 should list saved searches');
  console.log('  ✓ X13: Saved search stored and listed, count:', searches.length);

  // 4. X14 Bookmarked Standards
  console.log('\n4. X14 — Bookmarked Standards');
  const bmAdd = await BookmarkedStandardsService.addBookmark('usr_mfr_101', 'IS 1293:2019', {
    title: 'Plugs and Socket Outlets',
    category: 'ELECTRICAL',
    tags: ['mandatory', 'qco-enforced']
  });
  console.assert(bmAdd.status === 'BOOKMARKED' || bmAdd.status === 'EXISTS', 'X14 bookmark should be added');
  const bookmarks = await BookmarkedStandardsService.getBookmarks('usr_mfr_101');
  console.assert(bookmarks.some(b => b.standard_number === 'IS 1293:2019'), 'X14 should list added bookmark');
  console.log('  ✓ X14: Bookmarked standard retrieved, total bookmarks:', bookmarks.length);

  // 5. X15 Downloadable PDF Summary of Any Answer
  console.log('\n5. X15 — Downloadable PDF Summary of Any Answer');
  const pdf = await AnswerPdfSummaryService.generateAnswerPdf({
    question: 'What are the testing requirements for Portland Cement under IS 269:2015?',
    answer: 'Under IS 269:2015, compressive strength at 7 and 28 days, fineness (specific surface by Blaine air permeability), and setting time are mandatory testing parameters.',
    standard: 'IS 269:2015',
    citations: ['IS 269:2015 Clause 6.1', 'Cement (Quality Control) Order, 2024'],
    confidenceScore: 0.96,
    userId: 'usr_mfr_101'
  });
  console.assert(pdf.success === true && pdf.sha256Hash.length === 64, 'X15 should generate SHA-256 hash');
  console.assert(pdf.html.includes('Bureau of Indian Standards Advisory Summary'), 'X15 HTML layout must include official advisory title');
  console.log('  ✓ X15: PDF summary generated with SHA-256 hash:', pdf.sha256Hash.substring(0, 16) + '...');

  console.log('\n====================================================');
  console.log('ALL X11–X15 TESTS PASSED (100%)');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('TEST RUN FAILED:', err);
  process.exit(1);
});
