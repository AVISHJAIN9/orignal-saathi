import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { AppModule } from '../src/app.module';

const DEV_JWT_SECRET = 'dev-saathi-insecure-jwt-secret-do-not-use-in-prod-2026';

describe('Tier 3 Features Test Suite (T3-06 to T3-34)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    authToken = jwt.sign(
      { id: 'usr-admin-003', role: 'ADMIN', email: 'admin@saathi.gov.in' },
      DEV_JWT_SECRET,
      { expiresIn: '2h' }
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  // [T3-06] Developer platform: API keys & webhooks
  it('[T3-06] POST /api/v1/dev/api-keys & POST /dev/webhooks -> key issuance and HMAC webhook secret', async () => {
    const keyRes = await request(app.getHttpServer())
      .post('/api/v1/dev/api-keys')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        clientName: 'Integration Partner ERP',
        scopes: ['standards:read', 'consignments:check']
      });

    expect(keyRes.status).toBe(201);
    expect(keyRes.body.apiKey).toBeDefined();
    expect(keyRes.body.tokenBucketAlgorithm).toContain('Token Bucket');

    const whRes = await request(app.getHttpServer())
      .post('/api/v1/dev/webhooks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        url: 'https://partner.enterprise.com/webhooks/bis-events',
        events: ['gazette.parsed', 'license.renewed']
      });

    expect(whRes.status).toBe(201);
    expect(whRes.body.secret).toBeDefined();
    expect(whRes.body.sampleVerificationHeader).toContain('sha256=');
  });

  // [T3-08] Sub-component supply-chain compliance trace
  it('[T3-08] POST /api/v1/supply-chain/trace -> recursive compliance tree down to leaf components', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/supply-chain/trace')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ productId: 'PROD-KETTLE-01' });

    expect(res.status).toBe(200);
    expect(res.body.complianceTree).toBeDefined();
    expect(res.body.complianceTree.children.length).toBeGreaterThan(0);
    expect(res.body.totalComponentsAudited).toBeGreaterThan(0);
  });

  // [T3-11] Clause-level provenance/confidence graph
  it('[T3-11] GET /api/v1/clauses/:id/provenance -> returns retrieval chain and documented methodology', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/clauses/IS10500-4.1/provenance')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.retrievalChain).toBeDefined();
    expect(res.body.retrievalChain.vectorCosineSimilarity).toBeDefined();
    expect(res.body.confidenceMethodology.formula).toContain('CosineSim');
  });

  // [T3-33] Human-officer escalation with ticket handoff
  it('[T3-33] POST /api/v1/escalations & GET /escalations/:id/status -> officer assignment queue', async () => {
    const escRes = await request(app.getHttpServer())
      .post('/api/v1/escalations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        context: 'Discrepancy in lab test result limits for heavy metal leachate test.',
        userId: 'usr-101'
      });

    expect(escRes.status).toBe(201);
    expect(escRes.body.ticketId).toBeDefined();
    expect(escRes.body.status).toBe('QUEUED');

    const statusRes = await request(app.getHttpServer())
      .get(`/api/v1/escalations/${escRes.body.ticketId}/status`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.ticketId).toBe(escRes.body.ticketId);
  });

  // [T3-34] Dispute/grievance tracker
  it('[T3-34] POST /api/v1/grievances, GET /:id, PATCH /:id/status -> state machine and audit log', async () => {
    // 1. Create grievance
    const postRes = await request(app.getHttpServer())
      .post('/api/v1/grievances')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        subject: 'Inspection officer arrived 3 hours late and aborted audit',
        details: 'Audit scheduled for 10:00 AM, officer reached at 1:30 PM and refused to complete checklist.'
      });

    expect(postRes.status).toBe(201);
    const grvId = postRes.body.id;
    expect(postRes.body.status).toBe('FILED');

    // 2. Fetch single grievance with audit history
    const getRes = await request(app.getHttpServer())
      .get(`/api/v1/grievances/${grvId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.statusAuditTrail.length).toBeGreaterThanOrEqual(1);

    // 3. Update status (FILED -> UNDER_REVIEW)
    const patchRes = await request(app.getHttpServer())
      .patch(`/api/v1/grievances/${grvId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        status: 'UNDER_REVIEW',
        remarks: 'Assigned to Joint Director for enquiry.'
      });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.currentStatus).toBe('UNDER_REVIEW');
  });
});
