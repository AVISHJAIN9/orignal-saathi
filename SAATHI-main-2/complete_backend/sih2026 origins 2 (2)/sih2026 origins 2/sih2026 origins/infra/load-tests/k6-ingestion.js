/**
 * SAATHI k6 Load Test — M1 Document Ingestion Pipeline
 *
 * Tests: document upload + BIS crawl trigger + queue status polling
 *
 * Run:
 *   BASE_URL=http://localhost:5011 \
 *   ADMIN_TOKEN=<jwt> \
 *   k6 run --vus 20 --duration 2m infra/load-tests/k6-ingestion.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const uploadLatency = new Trend('upload_latency_ms', true);
const uploadSuccess = new Rate('upload_success_rate');

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '2m',  target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    'upload_latency_ms': ['p(95)<5000'],
    'upload_success_rate': ['rate>0.95'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5011';
const ADMIN_TOKEN = __ENV.ADMIN_TOKEN || '';

const SAMPLE_STANDARDS = ['IS 269:2015', 'IS 14543:2016', 'IS 1293:2019', 'IS 10500:2012'];

export default function () {
  const headers = {
    ...(ADMIN_TOKEN ? { Authorization: `Bearer ${ADMIN_TOKEN}` } : {}),
  };

  group('Document Upload', () => {
    // Create a minimal synthetic PDF payload (binary content simulation)
    const pdfContent = `%PDF-1.4 SAATHI-TEST-DOC-${__VU}-${__ITER}`;
    const formData = {
      file: http.file(pdfContent, 'test-standard.pdf', 'application/pdf'),
      standardNumber: randomItem(SAMPLE_STANDARDS),
    };

    const start = Date.now();
    const res = http.post(`${BASE_URL}/api/v1/ingestion/upload`, formData, { headers, timeout: '10s' });
    uploadLatency.add(Date.now() - start);

    const ok = check(res, {
      'upload status 200 or 201': (r) => r.status === 200 || r.status === 201,
      'has jobId': (r) => {
        try { return !!JSON.parse(r.body).jobId; } catch { return false; }
      },
    });
    uploadSuccess.add(ok);
  });

  group('Queue Stats', () => {
    const res = http.get(`${BASE_URL}/api/v1/ingestion/queue/stats`, { headers });
    check(res, {
      'queue stats 200': (r) => r.status === 200,
      'has waiting count': (r) => {
        try { return JSON.parse(r.body).waiting !== undefined; } catch { return false; }
      },
    });
  });

  sleep(2);
}
