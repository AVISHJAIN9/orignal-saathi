import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const QRCode = require('qrcode');
import { AppModule } from '../src/app.module';
import { createRedisClient } from '../src/common/services/redis.service';

const DEV_JWT_SECRET = 'dev-saathi-insecure-jwt-secret-do-not-use-in-prod-2026';

describe('Real Infrastructure Verification (BullMQ, Redis, Real OCR, Real QR, WhatsApp HMAC)', () => {
  let app: INestApplication;
  let authToken: string;
  const redis = createRedisClient();

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    authToken = jwt.sign(
      { id: 'usr-infra-tester', role: 'OFFICER', email: 'infra@bis.gov.in' },
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
    await redis.quit();
    if (app) {
      await app.close();
    }
  });

  // 1. Real BullMQ Job Lifecycle & Redis Persistence Test
  it('should enqueue job to real BullMQ Redis instance and complete asynchronously', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/certificates/validate')
      .set('Authorization', `Bearer ${authToken}`)
      .field('standardNumber', 'IS 10500:2012')
      .attach('file', Buffer.from('Test Report: pH=7.4, TDS=320 mg/L, Turbidity=0.5 NTU, Lead=0.002 mg/L'), 'test_cert.txt');

    expect(res.status).toBe(202);
    expect(res.body.jobId).toBeDefined();

    // Verify job key exists in Redis
    const redisKeys = await redis.keys('bull:cert-validation:*');
    expect(redisKeys.length).toBeGreaterThan(0);

    // Wait for worker processing
    await new Promise((resolve) => setTimeout(resolve, 300));

    const pollRes = await request(app.getHttpServer())
      .get(`/api/v1/jobs/${res.body.jobId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(pollRes.status).toBe(200);
    expect(pollRes.body.status).toBe('completed');
    expect(pollRes.body.data.overallStatus).toBe('PASS');
    expect(pollRes.body.data.parameters.length).toBe(4);
  });

  // 2. Real QR Decoding with sharp + jsQR
  it('should accurately decode a genuine QR code image using sharp + jsQR', async () => {
    // Generate real PNG QR code image buffer containing authentic CML license
    const qrBuffer = await QRCode.toBuffer('https://bis.gov.in/verify?cml=7200192984', {
      type: 'png',
      width: 250,
      margin: 2
    });
    const base64Data = qrBuffer.toString('base64');

    const verifyRes = await request(app.getHttpServer())
      .post('/api/v1/authenticity/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ imageBase64: `data:image/png;base64,${base64Data}` });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.status).toBe('verified');
    expect(verifyRes.body.licenseNumber).toBe('CM/L-7200192984');
    expect(verifyRes.body.confidenceScore).toBe(0.99);
  });

  it('should return unrecognized with "no QR code detected in image" for blank or non-QR images', async () => {
    // 10x10 transparent PNG image with no QR pattern
    const blankPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9QzwAEjDAGNYAAACfQA/4p50nAAAAAAElFTkSuQmCC',
      'base64'
    );

    const verifyRes = await request(app.getHttpServer())
      .post('/api/v1/authenticity/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ imageBase64: blankPng.toString('base64') });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.status).toBe('unrecognized');
    expect(verifyRes.body.reason).toContain('no QR code detected in image');
    expect(verifyRes.body.confidenceScore).toBe(0.0);
  });

  // 3. T1-18 Redis 24h Caching with FastAPI ML
  it('should cache clause explanations in real Redis with 24h TTL', async () => {
    const clauseId = 'IS10500-4.1';
    const cacheKey = `explain:${clauseId}:simple`;

    // Clear prior cache key
    await redis.del(cacheKey);

    // First call (cache miss)
    const firstRes = await request(app.getHttpServer())
      .post('/api/v1/explain')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ clauseId, level: 'simple' });

    expect(firstRes.status).toBe(200);
    expect(firstRes.body.cached).toBe(false);
    expect(firstRes.body.explanation).toContain('Plain-Language');

    // Check Redis TTL
    const ttl = await redis.ttl(cacheKey);
    expect(ttl).toBeGreaterThan(86300); // 24h = 86400s

    // Second call (cache hit from Redis)
    const secondRes = await request(app.getHttpServer())
      .post('/api/v1/explain')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ clauseId, level: 'simple' });

    expect(secondRes.status).toBe(200);
    expect(secondRes.body.cached).toBe(true);
    expect(secondRes.body.explanation).toBe(firstRes.body.explanation);
  });

  // 4. WhatsApp Webhook HMAC-SHA256 Signature Verification
  it('should verify WhatsApp webhook signature and reject invalid signatures with 401', async () => {
    process.env.WHATSAPP_APP_SECRET = 'test-meta-app-secret-key-12345';

    const payload = {
      message: 'What is the permissible pH limit for drinking water in IS 10500?',
      from: '919876543210'
    };
    const rawBody = JSON.stringify(payload);

    // Compute valid HMAC-SHA256
    const validHmac = crypto.createHmac('sha256', process.env.WHATSAPP_APP_SECRET);
    validHmac.update(rawBody);
    const validSignature = `sha256=${validHmac.digest('hex')}`;

    // Valid signature -> 200 OK
    const validRes = await request(app.getHttpServer())
      .post('/api/v1/whatsapp/webhook')
      .set('Authorization', `Bearer ${authToken}`)
      .set('x-hub-signature-256', validSignature)
      .send(payload);

    expect(validRes.status).toBe(200);
    expect(validRes.body.status).toBe('success');
    expect(validRes.body.routedToStrictQA).toBe(true);

    // Invalid signature -> 401 Unauthorized
    const invalidRes = await request(app.getHttpServer())
      .post('/api/v1/whatsapp/webhook')
      .set('Authorization', `Bearer ${authToken}`)
      .set('x-hub-signature-256', 'sha256=0000000000000000000000000000000000000000000000000000000000000000')
      .send(payload);

    expect(invalidRes.status).toBe(401);
  });
});
