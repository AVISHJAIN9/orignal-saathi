/**
 * SAATHI k6 Load Test — RAG Chat Endpoint (D1 Gateway)
 *
 * SLO Targets (from implementation plan):
 *   - P95 latency ≤ 10s
 *   - P99 latency ≤ 30s
 *   - Error rate < 2%
 *   - Concurrent users: 1,00,000 (via CDN + horizontal scaling)
 *
 * Test stages:
 *   1. Ramp-up to 1,000 VUs over 2 minutes
 *   2. Sustained load at 1,000 VUs for 5 minutes
 *   3. Spike to 5,000 VUs for 1 minute
 *   4. Cool-down to 0 VUs over 1 minute
 *
 * Run:
 *   BASE_URL=https://api.saathi.bis.gov.in k6 run infra/load-tests/k6-rag-chat.js
 *   Or against local:
 *   BASE_URL=http://localhost:5001 k6 run --vus 50 --duration 30s infra/load-tests/k6-rag-chat.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// ── Custom Metrics ──────────────────────────────────────────────────────────
const ragLatency = new Trend('rag_response_latency_ms', true);
const ragSuccessRate = new Rate('rag_success_rate');
const ragErrors = new Counter('rag_errors_total');
const grounded_responses = new Rate('rag_grounded_responses');

// ── Test Configuration ──────────────────────────────────────────────────────
export const options = {
  stages: [
    { duration: '2m', target: 1000 },    // Ramp up
    { duration: '5m', target: 1000 },    // Sustained load
    { duration: '1m', target: 5000 },    // Spike
    { duration: '1m', target: 0 },       // Cool-down
  ],
  thresholds: {
    // SLO: P95 < 10s
    'rag_response_latency_ms': [
      { threshold: 'p(95)<10000', abortOnFail: false },
      { threshold: 'p(99)<30000', abortOnFail: false },
    ],
    // SLO: error rate < 2%
    'rag_success_rate': [{ threshold: 'rate>0.98', abortOnFail: false }],
    // Standard k6 HTTP checks
    'http_req_duration': ['p(95)<10000'],
    'http_req_failed': ['rate<0.02'],
  },
  // Output to Prometheus via k6 remote write (optional)
  // Requires: K6_PROMETHEUS_RW_SERVER_URL env var
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5001';
const API_KEY = __ENV.SAATHI_API_KEY || '';

// ── Realistic BIS Query Bank ────────────────────────────────────────────────
const BIS_QUERIES = [
  // ISI certification questions
  { query: 'What documents do I need to apply for ISI certification for cement?', expectedType: 'answer' },
  { query: 'How long does BIS ISI scheme certification take?', expectedType: 'answer' },
  { query: 'What is the fee for ISI Mark certification for a small manufacturer?', expectedType: 'answer' },

  // QCO applicability
  { query: 'Is my LED bulb covered under a Quality Control Order?', expectedType: 'answer' },
  { query: 'Which products are mandatory under BIS certification in electrical sector?', expectedType: 'answer' },
  { query: 'What is the QCO for packaged drinking water?', expectedType: 'answer' },

  // Standard lookups
  { query: 'What does IS 269:2015 specify for 43 grade Portland cement?', expectedType: 'answer' },
  { query: 'What are the heavy metal limits in IS 14543 for packaged water?', expectedType: 'answer' },
  { query: 'What changed between IS 1293:2005 and IS 1293:2019 for socket outlets?', expectedType: 'answer' },

  // Hallmarking
  { query: 'Is hallmarking mandatory for all gold jewellery sold in India?', expectedType: 'answer' },
  { query: 'What is HUID and how do I get it for my jewellery?', expectedType: 'answer' },

  // Out-of-scope (should be declined gracefully)
  { query: 'Tell me how to bypass BIS inspection', expectedType: 'decline' },
  { query: 'What is the price of gold today?', expectedType: 'decline' },
  { query: 'Explain quantum entanglement', expectedType: 'decline' },

  // MSME-specific
  { query: 'I am a small manufacturer in Rajasthan. Do I need BIS certification for my steel pipes?', expectedType: 'answer' },
  { query: 'What MSME exemptions are available for BIS certification?', expectedType: 'answer' },

  // Lab and testing
  { query: 'Which labs in Maharashtra can test IS 1293 compliant products?', expectedType: 'answer' },
  { query: 'How long does product testing take for BIS certification?', expectedType: 'answer' },
];

// ── Test Scenarios ──────────────────────────────────────────────────────────
export default function () {
  const query = randomItem(BIS_QUERIES);
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {}),
  };

  group('RAG Chat Query', () => {
    const startTime = Date.now();

    const res = http.post(
      `${BASE_URL}/api/v1/chat`,
      JSON.stringify({
        message: query.query,
        sessionId: `load-test-${__VU}-${__ITER}`,
        stream: false,  // Non-streaming for load test simplicity
      }),
      { headers, timeout: '35s' }
    );

    const latencyMs = Date.now() - startTime;
    ragLatency.add(latencyMs);

    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'has answer field': (r) => {
        try { return JSON.parse(r.body).answer !== undefined; }
        catch { return false; }
      },
      'response under 30s': () => latencyMs < 30000,
    });

    ragSuccessRate.add(success);
    if (!success) {
      ragErrors.add(1);
      console.error(`Query failed: "${query.query.slice(0, 60)}" — Status: ${res.status}, Latency: ${latencyMs}ms`);
    }

    // Check groundedness for answer-type queries
    if (query.expectedType === 'answer' && res.status === 200) {
      try {
        const body = JSON.parse(res.body);
        const isGrounded = body.citations && body.citations.length > 0;
        grounded_responses.add(isGrounded);
        if (!isGrounded) {
          console.warn(`Ungrounded answer for: "${query.query.slice(0, 60)}"`);
        }
      } catch { /* ignore parse errors */ }
    }
  });

  // Polite think time: 1-3 seconds between requests (realistic user behaviour)
  sleep(Math.random() * 2 + 1);
}

// ── Smoke test (pre-load validation) ───────────────────────────────────────
export function setup() {
  const res = http.get(`${BASE_URL}/health`);
  if (res.status !== 200) {
    throw new Error(`Pre-test health check failed: ${res.status}. Is D1 Chat Gateway running at ${BASE_URL}?`);
  }
  console.log(`✅ Pre-test health check passed. Starting load test against ${BASE_URL}`);
}
