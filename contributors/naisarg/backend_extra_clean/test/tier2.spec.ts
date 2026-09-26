import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { AppModule } from '../src/app.module';

const DEV_JWT_SECRET = 'dev-saathi-insecure-jwt-secret-do-not-use-in-prod-2026';

describe('Tier 2 Features Test Suite (T2-01 to T2-32)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    authToken = jwt.sign(
      { id: 'usr-tester-002', role: 'REGULATOR', email: 'officer@bis.gov.in' },
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

  // [T2-01] Predictive QCO forecasting
  it('[T2-01] GET /api/v1/forecast/qco -> returns prediction, confidenceScore, and mandatory basis field', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/forecast/qco?category=Electrical')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.prediction).toBeDefined();
    expect(res.body.confidenceScore).toBeDefined();
    expect(['historical', 'seeded']).toContain(res.body.basis); // NEVER omitted
  });

  // [T2-07] State/UT regulatory overlay
  it('[T2-07] GET /api/v1/standards/:id/state-overlay -> returns verified state additions or not yet catalogued', async () => {
    // Sourced state
    const res = await request(app.getHttpServer())
      .get('/api/v1/standards/IS%204984:2016/state-overlay?state=Maharashtra')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.hasStateSpecificRules).toBe(true);
    expect(res.body.catalogStatus).toBe('VERIFIED_SAMPLE');
    expect(res.body.regulations.length).toBeGreaterThan(0);

    // Uncatalogued state
    const uncatRes = await request(app.getHttpServer())
      .get('/api/v1/standards/IS%204984:2016/state-overlay?state=Nagaland')
      .set('Authorization', `Bearer ${authToken}`);

    expect(uncatRes.status).toBe(200);
    expect(uncatRes.body.catalogStatus).toBe('NOT_YET_CATALOGUED');
  });

  // [T2-12] Complaint-driven insights dashboard
  it('[T2-12] GET /api/v1/complaints/insights -> aggregates complaints & flags synthetic provenance', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/complaints/insights?groupBy=standard')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.dataSource).toBe('Synthetic');
    expect(Array.isArray(res.body.insights)).toBe(true);
    expect(res.body.totalComplaintsAnalyzed).toBeGreaterThan(0);
  });

  // [T2-14] Lab wait-time estimator
  it('[T2-14] GET /api/v1/labs/:labId/wait-estimate -> computes queueing wait time based on backlog', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/labs/LAB-DEL-01/wait-estimate')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.totalEstimatedWaitDays).toBeGreaterThanOrEqual(res.body.standardTurnaroundDays);
    expect(res.body.currentBacklogQueue).toBeDefined();
  });

  // [T2-19] Cross-ministry conflict checker
  it('[T2-19] GET /api/v1/standards/:id/conflicts -> returns verified FSSAI/BEE/CDSCO overlaps', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/standards/IS%2010500:2012/conflicts')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.hasConflicts).toBe(true);
    expect(res.body.conflicts[0].ministry).toContain('FSSAI');
  });

  // [T2-30] Counterfeit hotspot map
  it('[T2-30] GET /api/v1/counterfeit/hotspots -> returns geojson format with coordinates', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/counterfeit/hotspots')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.type).toBe('FeatureCollection');
    expect(res.body.features.length).toBeGreaterThan(0);
    expect(res.body.features[0].geometry.coordinates.length).toBe(2);
  });

  // [T2-31] Peer benchmarking
  it('[T2-31] GET /api/v1/benchmark/:userId -> calculates percentile readiness against cohort', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/benchmark/usr-101')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.industryPercentile).toBe('number');
    expect(res.body.industryPercentile).toBeGreaterThanOrEqual(0);
    expect(res.body.industryPercentile).toBeLessThanOrEqual(100);
  });

  // [T2-32] Sector risk heatmap
  it('[T2-32] GET /api/v1/risk/sector-heatmap -> composite risk index across sectors', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/risk/sector-heatmap')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.sectorRisks.length).toBeGreaterThan(0);
    expect(res.body.sectorRisks[0].compositeRiskScore).toBeDefined();
  });
});
