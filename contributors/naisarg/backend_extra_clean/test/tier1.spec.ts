import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { io } from 'socket.io-client';
import { AppModule } from '../src/app.module';
import { createRedisClient } from '../src/common/services/redis.service';

const DEV_JWT_SECRET = 'dev-saathi-insecure-jwt-secret-do-not-use-in-prod-2026';

describe('Tier 1 Features Test Suite (T1-02 to T1-29)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const redis = createRedisClient();
    try {
      await redis.flushall();
    } catch {
      // ignore
    } finally {
      await redis.quit();
    }

    authToken = jwt.sign(
      { id: 'usr-tester-001', role: 'MANUFACTURER', email: 'test@enterprise.gov.in' },
      DEV_JWT_SECRET,
      { expiresIn: '2h' }
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(0);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  // [T1-02] Clause-level standard diff engine
  it('[T1-02] POST /api/v1/standards/diff -> should calculate clause-by-clause diff and cache in table', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/standards/diff')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        oldStandardId: 'std-is-10500-1991',
        newStandardId: 'std-is-10500-2012'
      });

    expect(res.status).toBe(200);
    expect(res.body.differences).toBeDefined();
    expect(Array.isArray(res.body.differences)).toBe(true);
    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.totalClausesCompared).toBeGreaterThan(0);
    expect(res.body.cached).toBe(false);

    // Second call should return cached: true
    const cachedRes = await request(app.getHttpServer())
      .post('/api/v1/standards/diff')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        oldStandardId: 'std-is-10500-1991',
        newStandardId: 'std-is-10500-2012'
      });
    expect(cachedRes.status).toBe(200);
    expect(cachedRes.body.cached).toBe(true);
  });

  // [T1-03] Certificate/test-report OCR validator
  it('[T1-03] POST /api/v1/certificates/validate & GET /api/v1/jobs/:id -> async job queue', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/certificates/validate')
      .set('Authorization', `Bearer ${authToken}`)
      .field('standardNumber', 'IS 10500:2012')
      .attach('file', Buffer.from('Test Report: pH=7.4, TDS=320 mg/L, Turbidity=0.5 NTU, Lead=0.002 mg/L'), 'test_cert.txt');

    expect(res.status).toBe(202);
    expect(res.body.jobId).toBeDefined();
    expect(res.body.status).toBe('queued');

    // Wait for job completion in event loop
    await new Promise((r) => setTimeout(r, 50));

    const pollRes = await request(app.getHttpServer())
      .get(`/api/v1/jobs/${res.body.jobId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(pollRes.status).toBe(200);
    expect(pollRes.body.status).toBe('completed');
    expect(pollRes.body.data.overallStatus).toBe('PASS');
    expect(pollRes.body.data.parameters.length).toBeGreaterThan(0);
  });

  // [T1-04] Datasheet/spec-sheet compliance scanner
  it('[T1-04] POST /api/v1/datasheets/scan -> clause-level compliance table', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/datasheets/scan')
      .set('Authorization', `Bearer ${authToken}`)
      .field('standardNumber', 'IS 10500:2012')
      .attach('file', Buffer.from('Datasheet: pH=7.1, TDS=450 mg/L, Lead=0.008 mg/L'), 'datasheet.txt');

    expect(res.status).toBe(200);
    expect(res.body.clauseTable).toBeDefined();
    expect(res.body.clauseTable.length).toBeGreaterThan(0);
    expect(res.body.overallCompliance).toBe(true);
  });

  // [T1-05] ISI mark / HUID authenticity verifier
  it('[T1-05] POST /api/v1/authenticity/verify -> verify authentic & detect counterfeit', async () => {
    // Verified license
    const validRes = await request(app.getHttpServer())
      .post('/api/v1/authenticity/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ qrPayload: 'https://bis.gov.in/verify?cml=7200192984' });

    expect(validRes.status).toBe(200);
    expect(validRes.body.status).toBe('verified');
    expect(validRes.body.licenseNumber).toBe('CM/L-7200192984');

    // Expired license
    const expiredRes = await request(app.getHttpServer())
      .post('/api/v1/authenticity/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ qrPayload: 'CM/L-5491029384' });

    expect(expiredRes.status).toBe(200);
    expect(expiredRes.body.status).toBe('counterfeit');

    // Counterfeit flag
    const fakeRes = await request(app.getHttpServer())
      .post('/api/v1/authenticity/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ qrPayload: 'CM/L-9999999999' });

    expect(fakeRes.status).toBe(200);
    expect(fakeRes.body.status).toBe('counterfeit');
  });

  // [T1-09] GeM tender compliance matcher
  it('[T1-09] POST /api/v1/tenders/match -> extract standards & gap table', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/tenders/match')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        tenderText: 'Supply of drinking water pipelines conforming to IS 4984:2016 and electrical plugs under IS 1293:2019.'
      });

    expect(res.status).toBe(200);
    expect(res.body.extractedStandards).toBeDefined();
    expect(res.body.tenderMatrix.length).toBeGreaterThan(0);
    expect(typeof res.body.eligibilityPercentage).toBe('number');
  });

  // [T1-10] "What-if" regulatory sandbox simulator
  it('[T1-10] POST /api/v1/sandbox/simulate -> stateless evaluation, p95 < 200ms', async () => {
    const startTime = Date.now();
    const res = await request(app.getHttpServer())
      .post('/api/v1/sandbox/simulate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        standardNumber: 'IS 10500:2012',
        productSpec: {
          pH: 7.4,
          TDS: 420,
          Turbidity: 0.8,
          Lead: 0.004,
          Arsenic: 0.005,
          Fluoride: 0.8
        }
      });

    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeLessThan(200);
    expect(res.status).toBe(200);
    expect(res.body.overallCompliance).toBe(true);
    expect(res.body.passedCount).toBeGreaterThan(0);
  });

  // [T1-15] Certification-path cost/time optimizer
  it('[T1-15] GET /api/v1/certification/paths -> return sorted comparison array', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/certification/paths?productCategory=Electrical&sortBy=cost')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.paths)).toBe(true);
    expect(res.body.paths.length).toBeGreaterThan(0);
    expect(res.body.paths[0].avgCostINR).toBeLessThanOrEqual(res.body.paths[res.body.paths.length - 1].avgCostINR);
  });

  // [T1-16] Standard genealogy/version graph explorer
  it('[T1-16] GET /api/v1/standards/:id/genealogy -> nodes and edges graph', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/standards/IS%2010500:2012/genealogy')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.nodes.length).toBeGreaterThan(0);
    expect(res.body.edges.length).toBeGreaterThan(0);
  });

  // [T1-17] Auto-drafted appeal/reapplication letter
  it('[T1-17] POST /api/v1/letters/appeal -> letter text + docx base64', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/letters/appeal')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        rejectionReasonIds: ['ERR-LAB-01'],
        applicantDetails: {
          applicantName: 'Vikram Joshi',
          companyName: 'Bharat Switchgear Industries Ltd',
          applicationNumber: 'BIS/APP/2026/0419'
        },
        standardNumber: 'IS 1293:2019'
      });

    expect(res.status).toBe(200);
    expect(res.body.letterText).toContain('Regulation 11');
    expect(res.body.docxBase64).toBeDefined();
    expect(res.body.statutoryCitations.length).toBeGreaterThan(0);
  });

  // [T1-18] Reading-level adaptive explanation toggle
  it('[T1-18] POST /api/v1/explain -> simple and technical explanations with 24h caching', async () => {
    const resSimple = await request(app.getHttpServer())
      .post('/api/v1/explain')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        clauseId: 'IS10500-4.1',
        level: 'simple'
      });

    expect(resSimple.status).toBe(200);
    expect(resSimple.body.explanation).toContain('Plain-Language');
    expect(resSimple.body.cached).toBe(false);

    // Second call should return cached: true
    const cachedSimple = await request(app.getHttpServer())
      .post('/api/v1/explain')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        clauseId: 'IS10500-4.1',
        level: 'simple'
      });
    expect(cachedSimple.body.cached).toBe(true);
  });

  // [T1-13/20] License renewal dashboard + pre-filled draft
  it('[T1-13/20] GET /api/v1/licenses/:id/renewal-status & POST /renewal-draft', async () => {
    const statusRes = await request(app.getHttpServer())
      .get('/api/v1/licenses/CM%2FL-7200192984/renewal-status')
      .set('Authorization', `Bearer ${authToken}`);

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.daysToExpiry).toBeDefined();
    expect(['URGENT', 'UPCOMING', 'OK', 'EXPIRED']).toContain(statusRes.body.renewalTier);

    const draftRes = await request(app.getHttpServer())
      .post('/api/v1/licenses/CM%2FL-7200192984/renewal-draft')
      .set('Authorization', `Bearer ${authToken}`);

    expect(draftRes.status).toBe(201);
    expect(draftRes.body.prefilledFormFields).toBeDefined();
  });

  // [T1-20] Live production-parameter monitoring hook
  it('[T1-20] WS /api/v1/monitoring/stream/:productId -> telemetry stream & breach alert via WebSocket', async () => {
    const address = app.getHttpServer().address();
    const port = typeof address === 'string' ? address : address.port;
    const socket = io(`http://localhost:${port}/api/v1/monitoring/stream/PROD-PLUG-1293`, {
      transports: ['websocket'],
      reconnection: false,
      timeout: 5000,
    });

    const telemetryData = await new Promise<any>((resolve, reject) => {
      const timeout = setTimeout(() => {
        socket.disconnect();
        reject(new Error('Timed out waiting for WS telemetry event'));
      }, 5000);

      socket.on('telemetry', (data) => {
        clearTimeout(timeout);
        socket.disconnect();
        resolve(data);
      });

      socket.on('connect_error', (err) => {
        clearTimeout(timeout);
        socket.disconnect();
        reject(err);
      });
    });

    expect(telemetryData).toBeDefined();
    expect(telemetryData.productId).toBe('PROD-PLUG-1293');
    expect(telemetryData.readings.length).toBeGreaterThan(0);
    expect(telemetryData.readings[0].parameter).toBeDefined();

    // Verify polling fallback also works
    const res = await request(app.getHttpServer())
      .get('/api/v1/monitoring/stream/PROD-PLUG-1293')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.readings.length).toBeGreaterThan(0);
  });

  // [T1-21] Label/marking compliance checker via photo
  it('[T1-21] POST /api/v1/labels/check -> run against label_rules table', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/labels/check')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        productCategory: 'Electrical',
        simulatedOcrText: 'IS 1293 CM/L-7200192984 250V AC B.No: 2026/08/11'
      });

    expect(res.status).toBe(200);
    expect(res.body.rulesEvaluated.length).toBeGreaterThan(0);
    expect(res.body.overallCompliance).toBe(true);
  });

  // [T1-22] Bulk import consignment checker
  it('[T1-22] POST /api/v1/consignments/bulk-check -> CSV batch rules evaluation', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/consignments/bulk-check')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        csvContent: 'HSN,Description,Standard,Quantity,Parameter,Value\n85366910,Socket 16A,IS 1293:2019,1000,TerminalTempRise,41.0'
      });

    expect(res.status).toBe(200);
    expect(res.body.rowResults.length).toBe(1);
    expect(res.body.clearanceStatus).toBe('CLEARED_FOR_CUSTOMS');
  });

  // [T1-23] Live Gazette notification parser
  it('[T1-23] POST /api/v1/gazette/parse -> parse standards and upsert table (<3s)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/gazette/parse')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        gazetteText: 'MINISTRY OF COMMERCE ORDER: The Electrical Accessories QCO, 2026. Goods shall conform to IS 1293:2019.'
      });

    expect(res.status).toBe(200);
    expect(res.body.extractedStandards).toContain('IS 1293:2019');
    expect(res.body.parseTimeMs).toBeLessThan(3000);
    expect(res.body.storedInDatabase).toBe(true);
  });

  // [T1-24] Live regulatory alert ticker
  it('[T1-24] GET /api/v1/alerts/feed -> stream new rows from gazette_notifications & alerts', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/alerts/feed')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.alerts.length).toBeGreaterThan(0);
  });

  // [T1-25] Personalized compliance calendar
  it('[T1-25] GET /api/v1/calendar/:userId -> aggregate deadlines into Gantt JSON', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/calendar/usr-101')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.events.length).toBeGreaterThan(0);
    expect(res.body.events[0].title).toBeDefined();
    expect(res.body.events[0].start).toBeDefined();
  });

  // [T1-26] "Cite or decline" trust demo
  it('[T1-26] POST /api/v1/qa/strict -> cite grounded or decline out-of-corpus question', async () => {
    // Grounded question -> Cite
    const citeRes = await request(app.getHttpServer())
      .post('/api/v1/qa/strict')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ question: 'What is the permissible TDS limit in IS 10500 drinking water?' });

    expect(citeRes.status).toBe(200);
    expect(citeRes.body.declined).toBe(false);
    expect(citeRes.body.groundedCitations.length).toBeGreaterThan(0);

    // Out-of-corpus question -> Decline
    const declineRes = await request(app.getHttpServer())
      .post('/api/v1/qa/strict')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ question: 'What is the recipe for baking chocolate brownies?' });

    expect(declineRes.status).toBe(200);
    expect(declineRes.body.declined).toBe(true);
    expect(declineRes.body.answer).toBeNull();
  });

  // [T1-27] Live WhatsApp bot
  it('[T1-27] POST /api/v1/whatsapp/webhook -> parse message and route to strict QA', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/whatsapp/webhook')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        message: 'Tell me the setting time limit for ordinary portland cement in IS 269',
        from: '919876543210'
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.routedToStrictQA).toBe(true);
    expect(res.body.outgoingReply).toBeDefined();
  });

  // [T1-28] Embeddable "BIS Verified" widget (Public, No Auth, CORS Open)
  it('[T1-28] GET /api/v1/widget/verify/:licenseId -> public, no auth header needed, SVG badge', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/widget/verify/CM%2FL-7200192984'); // No Authorization header!

    expect(res.status).toBe(200);
    expect(res.header['access-control-allow-origin']).toBe('*');
    expect(res.body.isVerified).toBe(true);
    expect(res.body.svgBadge).toContain('<svg');
  });

  // [T1-29] Self-audit checklist with photo-evidence upload
  it('[T1-29] POST /evidence & GET /readiness -> compute readiness percentage', async () => {
    const uploadRes = await request(app.getHttpServer())
      .post('/api/v1/self-audit/PROD-PLUG-16A/items/audit-item-01/evidence')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('evidence', Buffer.from('RAW_MATERIAL_CERT_DATA'), 'cert.jpg');

    expect(uploadRes.status).toBe(200);
    expect(uploadRes.body.item.completed).toBe(true);

    const readinessRes = await request(app.getHttpServer())
      .get('/api/v1/self-audit/PROD-PLUG-16A/readiness')
      .set('Authorization', `Bearer ${authToken}`);

    expect(readinessRes.status).toBe(200);
    expect(typeof readinessRes.body.readinessPercentage).toBe('number');
    expect(readinessRes.body.readinessPercentage).toBeGreaterThanOrEqual(66);
  });
});
