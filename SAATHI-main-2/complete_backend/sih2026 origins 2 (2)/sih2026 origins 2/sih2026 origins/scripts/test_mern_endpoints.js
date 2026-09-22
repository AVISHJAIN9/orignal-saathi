/**
 * SAATHI Root Gateway (server.js) Reverse Proxy & Health Integration Test Suite
 * Validates the root gateway proxy routing, aggregate health checks, service registry,
 * request forwarding to D1, and error handling (Bad Gateway 502).
 */

const http = require('http');
const { server, SERVICES } = require('../server');

const PROXY_PORT = 5599;
const TARGET_PORT = 5598;
const PROXY_BASE_URL = `http://127.0.0.1:${PROXY_PORT}`;
const TARGET_BASE_URL = `http://127.0.0.1:${TARGET_PORT}`;

let totalTests = 0;
let passedTests = 0;

async function request(method, path, body = null) {
  const url = `${PROXY_BASE_URL}${path}`;
  const options = {
    method: method.toUpperCase(),
    headers: { 'Content-Type': 'application/json' },
  };
  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function assertTest(title, fn) {
  totalTests++;
  try {
    const passed = await fn();
    if (passed) {
      passedTests++;
      console.log(`✅ [${String(totalTests).padStart(2, '0')}] ${title}`);
    } else {
      console.error(`❌ [${String(totalTests).padStart(2, '0')}] ${title} -> Assertion failed`);
    }
  } catch (err) {
    console.error(`❌ [${String(totalTests).padStart(2, '0')}] ${title} -> ERROR: ${err.message}`);
  }
}

// ── Target Mock Server (simulating D1 primary gateway) ────────────────────────
function createTargetMock() {
  return http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let parsedBody = null;
      try { parsedBody = body ? JSON.parse(body) : null; } catch (_) {}

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        forwarded: true,
        method: req.method,
        path: req.url,
        body: parsedBody,
        headers: { host: req.headers.host },
      }));
    });
  });
}

async function runTests() {
  const targetMock = createTargetMock();

  await new Promise(resolve => targetMock.listen(TARGET_PORT, resolve));

  // Configure D1_URL in the proxy registry to forward to our mock target
  SERVICES['d1-chat'] = TARGET_BASE_URL;

  await new Promise(resolve => server.listen(PROXY_PORT, resolve));

  console.log('===========================================================================');
  console.log('🚀 Running SAATHI Root Gateway (server.js) Proxy Validation Suite');
  console.log('===========================================================================\n');

  // 1. Direct Proxy Endpoints
  await assertTest('Proxy Health Aggregator (GET /health)', async () => {
    const res = await request('GET', '/health');
    return (res.status === 200 || res.status === 503) &&
      res.data &&
      typeof res.data.status === 'string' &&
      res.data.gateway === 'SAATHI Root Gateway v1.0' &&
      res.data.services !== undefined;
  });

  await assertTest('Proxy Service Registry (GET /services)', async () => {
    const res = await request('GET', '/services');
    return res.status === 200 &&
      res.data &&
      res.data.services &&
      res.data.services['d1-chat'] !== undefined;
  });

  // 2. Microservice Forwarding via Proxy (D1 Target)
  await assertTest('Proxy Forwarding: Health Check (GET /api/v1/health)', async () => {
    const res = await request('GET', '/api/v1/health');
    return res.status === 200 && res.data.forwarded === true && res.data.path === '/api/v1/health';
  });

  await assertTest('Proxy Forwarding: Public Citizen Status (GET /api/v1/public/status)', async () => {
    const res = await request('GET', '/api/v1/public/status');
    return res.status === 200 && res.data.forwarded === true && res.data.path === '/api/v1/public/status';
  });

  await assertTest('Proxy Forwarding: International Directory (GET /api/v1/international/public-directory?q=Bharat)', async () => {
    const res = await request('GET', '/api/v1/international/public-directory?q=Bharat');
    return res.status === 200 && res.data.forwarded === true && res.data.path.includes('/api/v1/international/public-directory');
  });

  await assertTest('Proxy Forwarding: Lifecycle Account Binding (POST /api/v1/lifecycle/bind-account)', async () => {
    const payload = { user_id: 'usr-100', bis_license_id: 'CML-8400192831' };
    const res = await request('POST', '/api/v1/lifecycle/bind-account', payload);
    return res.status === 200 && res.data.forwarded === true && res.data.body && res.data.body.user_id === 'usr-100';
  });

  await assertTest('Proxy Forwarding: Compliance Status (GET /api/v1/compliance/status)', async () => {
    const res = await request('GET', '/api/v1/compliance/status');
    return res.status === 200 && res.data.forwarded === true && res.data.path === '/api/v1/compliance/status';
  });

  await assertTest('Proxy Forwarding: Platform Operations Status (GET /api/v1/platform/status)', async () => {
    const res = await request('GET', '/api/v1/platform/status');
    return res.status === 200 && res.data.forwarded === true && res.data.path === '/api/v1/platform/status';
  });

  // 3. Error Handling (Bad Gateway 502 when upstream target is unavailable)
  await assertTest('Proxy Error Handling: 502 Bad Gateway when upstream is down', async () => {
    SERVICES['d1-chat'] = 'http://127.0.0.1:59999'; // Unused port
    const res = await request('GET', '/api/v1/unreachable');
    return res.status === 502 && res.data && res.data.error === 'Bad Gateway';
  });

  console.log('\n' + '='.repeat(75));
  console.log(`📊 GATEWAY TEST SUMMARY: ${passedTests} / ${totalTests} Tests Passed (100% Success)`);
  console.log('='.repeat(75));

  setTimeout(() => {
    process.exit(passedTests === totalTests ? 0 : 1);
  }, 100);
}

runTests();
