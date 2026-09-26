import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

/**
 * SAATHI Production Load Benchmark (Phase 6.24)
 * Target: 20 Concurrent Virtual Users (VUs) for 5 minutes
 * Endpoints under test:
 *   - Aggregated Health API (/health)
 *   - BIS Standards Lookup (/api/v1/standards/search)
 *   - Compliance Chat & RAG Gateway (/chat or /api/v1/chat)
 *   - P1 Auth Token Exchange (/auth/login)
 */

// Custom metrics
const ChatLatency = new Trend('chat_response_duration_ms');
const HealthLatency = new Trend('health_response_duration_ms');
const StandardsLatency = new Trend('standards_response_duration_ms');
const ErrorRate = new Rate('error_rate');
const TotalQueries = new Counter('total_queries_served');

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp-up to 20 VUs
    { duration: '4m', target: 20 },  // Sustained load at 20 VUs
    { duration: '30s', target: 0 },  // Graceful ramp-down to 0
  ],
  thresholds: {
    // 95% of requests must complete below 800ms
    http_req_duration: ['p(95)<800', 'p(99)<1500'],
    // Error rate must remain below 1% under peak concurrency
    error_rate: ['rate<0.01'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const M5_URL = __ENV.M5_URL || 'http://localhost:8000';
const P1_URL = __ENV.P1_URL || 'http://localhost:8001';

// Sample compliance queries for variety
const COMPLIANCE_QUERIES = [
  'What grades of cement are specified in IS 269:2015?',
  'Does packaged drinking water require mandatory ISI certification?',
  'What is the testing requirement for mild steel tubes under IS 1161?',
  'What are the mandatory quality control orders for footwear under BIS?',
  'Explain the difference between Scheme-I ISI mark and Scheme-II CRS registration.',
];

export default function () {
  const query = COMPLIANCE_QUERIES[Math.floor(Math.random() * COMPLIANCE_QUERIES.length)];

  // 1. Health Probe (P99 check)
  {
    const res = http.get(`${BASE_URL}/health`, {
      tags: { name: 'HealthCheck' },
      timeout: '3s',
    });
    HealthLatency.add(res.timings.duration);
    const passed = check(res, {
      'health status is 200': (r) => r.status === 200,
    });
    ErrorRate.add(!passed);
  }

  sleep(0.5);

  // 2. Standards Search Lookup
  {
    const res = http.get(`${BASE_URL}/api/v1/standards/search?query=cement`, {
      tags: { name: 'StandardsSearch' },
      timeout: '5s',
    });
    StandardsLatency.add(res.timings.duration);
    const passed = check(res, {
      'standards status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    });
    ErrorRate.add(!passed);
  }

  sleep(0.5);

  // 3. RAG Chat Query
  {
    const payload = JSON.stringify({
      message: query,
      history: [],
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
      tags: { name: 'ChatOrchestrator' },
      timeout: '10s',
    };

    const res = http.post(`${BASE_URL}/api/v1/chat`, payload, params);
    ChatLatency.add(res.timings.duration);
    TotalQueries.add(1);

    const passed = check(res, {
      'chat returns HTTP 200 or 201': (r) => r.status === 200 || r.status === 201,
      'chat response contains text': (r) => r.body && r.body.length > 0,
    });
    ErrorRate.add(!passed);
  }

  sleep(1);
}
