import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { AppModule } from '../src/app.module';

const DEV_JWT_SECRET = 'dev-saathi-insecure-jwt-secret-do-not-use-in-prod-2026';

describe('FastAPI ML Services Live Integration Tests (T1-17, T1-26, T2-01)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    authToken = jwt.sign(
      { id: 'usr-ml-tester', role: 'APPLICANT', email: 'tester@enterprise.in' },
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

  // T1-17 Live HTTP call to FastAPI /api/v1/ml/letters/appeal
  it('[T1-17 Integration] POST /api/v1/letters/appeal -> calls FastAPI service over HTTP', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/letters/appeal')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        rejectionReasonIds: ['REJ-TEST-01', 'REJ-TEST-02'],
        applicantDetails: {
          applicantName: 'Dev Sharma',
          companyName: 'Apex Cables Pvt Ltd',
          applicationNumber: 'APP-9988'
        },
        standardNumber: 'IS 1293:2019'
      });

    expect(res.status).toBe(200);
    expect(res.body.letterText).toContain('Regulation 11');
    expect(res.body.docxBase64).toBeDefined();
    expect(res.body.statutoryCitations).toContain('Section 13, Bureau of Indian Standards Act, 2016');
  });

  // T1-26 Live HTTP call to FastAPI /api/v1/ml/qa/strict
  it('[T1-26 Integration In-Corpus] POST /api/v1/qa/strict -> returns grounded answer via FastAPI', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/qa/strict')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        question: 'What is the pH limit for drinking water under IS 10500?'
      });

    expect(res.status).toBe(200);
    expect(res.body.declined).toBe(false);
    expect(res.body.confidenceScore).toBeGreaterThanOrEqual(0.9);
    expect(res.body.answer).toContain('IS 10500:2012');
  });

  it('[T1-26 Integration Out-of-Corpus] POST /api/v1/qa/strict -> triggers authoritative decline guardrail', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/qa/strict')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        question: 'What are the cooking instructions for tandoori chicken?'
      });

    expect(res.status).toBe(200);
    expect(res.body.declined).toBe(true);
    expect(res.body.answer).toBeNull();
    expect(res.body.reason).toContain('Declined by SAATHI Grounding Guardrail');
  });

  // T2-01 Live HTTP call to FastAPI /api/v1/ml/forecast/qco
  it('[T2-01 Integration Historical] GET /api/v1/forecast/qco -> returns scikit-learn regression result', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/forecast/qco?category=Electrical')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.basis).toBe('historical');
    expect(res.body.confidenceScore).toBeGreaterThan(0.5);
    expect(res.body.notes).toContain('scikit-learn');
  });

  it('[T2-01 Integration Seeded Fallback] GET /api/v1/forecast/qco -> returns seeded basis for unsourced category', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/forecast/qco?category=NonExistentCategoryXYZ')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.basis).toBe('seeded');
  });
});
