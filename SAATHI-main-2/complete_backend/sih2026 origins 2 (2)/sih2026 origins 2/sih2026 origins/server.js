#!/usr/bin/env node
/**
 * SAATHI Root Gateway — server.js
 * Phase 1.3: Replaces the broken "main": "server.js" reference.
 *
 * This is a lightweight process-manager / health aggregator that:
 *  1. Confirms all required env vars are set (fail-closed).
 *  2. Proxies /health to each microservice.
 *  3. Forwards unrecognised routes to D1 (the primary API gateway, port 5001).
 *
 * In production the preferred routing layer is the k8s ingress at
 * infra/k8s/base/ingress.yaml. Run this file ONLY for local dev / CI smoke-test.
 *
 * Usage:
 *   node server.js          # starts on PORT (default 3000)
 *   SAATHI_LOG_LEVEL=debug node server.js
 */

'use strict';

const http = require('http');
const https = require('https');

// ── Fail-closed: refuse to start without a minimal config ───────────────────
const REQUIRED_VARS = ['DB_HOST', 'DB_PASSWORD', 'JWT_SECRET'];
const missing = REQUIRED_VARS.filter(v => !process.env[v]);
if (missing.length > 0 && process.env.NODE_ENV === 'production') {
  console.error(`[SAATHI gateway] FATAL: missing required env vars: ${missing.join(', ')}`);
  console.error('[SAATHI gateway] Set these variables before starting in production.');
  process.exit(1);
}

// ── Service registry (matches docker-compose.prod.yml port assignments) ─────
const SERVICES = {
  'd1-chat':       process.env.D1_URL            ?? 'http://localhost:5001',
  'backend-extra': process.env.BACKEND_EXTRA_URL ?? 'http://localhost:3005',
  'd4-history':    process.env.D4_URL            ?? 'http://localhost:5004',
  'd5-admin':      process.env.D5_URL            ?? 'http://localhost:5005',
  'd9-wizard':     process.env.D9_URL            ?? 'http://localhost:5009',
  'd10-roles':     process.env.D10_URL           ?? 'http://localhost:5010',
  'm5-rag':        process.env.M5_URL            ?? 'http://localhost:8000',
  'p1-auth':       process.env.P1_URL            ?? 'http://localhost:8001',
  'p2-retention':  process.env.P2_URL            ?? 'http://localhost:8002',
  'p3-consent':    process.env.P3_URL            ?? 'http://localhost:8003',
  'p4-audit':      process.env.P4_URL            ?? 'http://localhost:8004',
};

const PORT = parseInt(process.env.PORT ?? '3000', 10);
const D1_URL = SERVICES['d1-chat'];

// ── Simple HTTP proxy helper ────────────────────────────────────────────────
function proxyRequest(targetBase, req, res) {
  const url = new URL(req.url, targetBase);
  const lib = url.protocol === 'https:' ? https : http;
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: req.method,
    headers: { ...req.headers, host: url.host },
  };
  const proxy = lib.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });
  proxy.on('error', (err) => {
    console.error('[SAATHI gateway] Proxy error:', err.message);
    try { proxy.destroy(); } catch (_) {}
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Bad Gateway', detail: err.message }));
    }
  });
  req.pipe(proxy, { end: true });
}

// ── Health check: ping every registered service ─────────────────────────────
async function pingService(name, baseUrl) {
  return new Promise((resolve) => {
    const lib = baseUrl.startsWith('https') ? https : http;
    const healthUrl = new URL('/health', baseUrl);
    const req = lib.get(healthUrl.toString(), (res) => {
      resolve({ name, status: res.statusCode === 200 ? 'healthy' : `HTTP ${res.statusCode}` });
    });
    req.setTimeout(2000, () => { req.destroy(); resolve({ name, status: 'timeout' }); });
    req.on('error', () => resolve({ name, status: 'unreachable' }));
  });
}

// ── Main HTTP server ─────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  // Global Security & CORS Headers
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Last-Event-ID, x-user-id, accept-language, x-request-id');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Hardened Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Distributed Tracing Correlation ID
  const requestId = req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  res.setHeader('X-Request-ID', requestId);
  req.headers['x-request-id'] = requestId;

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const method = req.method;
  const url = req.url;

  // Aggregate health endpoint — does not require auth
  if (method === 'GET' && url === '/health') {
    const checks = await Promise.all(
      Object.entries(SERVICES).map(([name, base]) => pingService(name, base))
    );
    const allHealthy = checks.every(c => c.status === 'healthy');
    res.writeHead(allHealthy ? 200 : 503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: allHealthy ? 'healthy' : 'degraded',
      gateway: 'SAATHI Root Gateway v1.0',
      timestamp: new Date().toISOString(),
      services: Object.fromEntries(checks.map(c => [c.name, c.status])),
    }));
    return;
  }

  // Service registry map endpoint
  if (method === 'GET' && url === '/services') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      gateway: 'SAATHI Root Gateway v1.0',
      services: SERVICES,
    }));
    return;
  }

  // Service Hub / Welcome page for root URL
  if (method === 'GET' && (url === '/' || url === '')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>SAATHI — BIS Intelligent Assistant Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 600px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
          h1 { margin-top: 0; font-size: 26px; color: #38bdf8; display: flex; align-items: center; gap: 10px; }
          p { color: #94a3b8; line-height: 1.6; }
          .btn-grid { display: grid; gap: 12px; margin-top: 24px; }
          a.btn { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; transition: transform 0.15s, background 0.15s; }
          a.primary { background: #2563eb; color: #ffffff; }
          a.primary:hover { background: #1d4ed8; transform: translateY(-1px); }
          a.secondary { background: #334155; color: #e2e8f0; }
          a.secondary:hover { background: #475569; transform: translateY(-1px); }
          .badge { background: #059669; color: #ecfdf5; font-size: 11px; padding: 3px 8px; border-radius: 20px; text-transform: uppercase; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h1>🇮🇳 SAATHI Navigator</h1>
            <span class="badge">Online & Connected</span>
          </div>
          <p>Smart India Hackathon 2026 (Problem SIH26107 — BIS Intelligent Assistant). Full-stack integration active.</p>
          <div class="btn-grid">
            <a href="http://localhost:8080" class="btn primary">
              <span>🚀 Open SAATHI Web App</span>
              <span>Port 8080 →</span>
            </a>
            <a href="http://localhost:5001/api/docs" class="btn secondary">
              <span>📚 D1 Gateway Swagger Docs</span>
              <span>Port 5001/api/docs →</span>
            </a>
            <a href="http://localhost:8000/docs" class="btn secondary">
              <span>🤖 AI & RAG Engine Docs</span>
              <span>Port 8000/docs →</span>
            </a>
            <a href="/health" class="btn secondary">
              <span>🩺 Gateway Health & Status</span>
              <span>/health →</span>
            </a>
          </div>
        </div>
      </body>
      </html>
    `);
    return;
  }

  const BACKEND_EXTRA_ROUTES = [
    '/api/v1/standards/diff',
    '/api/v1/certificates/validate',
    '/api/v1/jobs/',
    '/api/v1/datasheets/scan',
    '/api/v1/authenticity/verify',
    '/api/v1/tenders/match',
    '/api/v1/sandbox/simulate',
    '/api/v1/certification/paths',
    '/api/v1/letters/appeal',
    '/api/v1/explain',
    '/api/v1/licenses/',
    '/api/v1/monitoring/stream/',
    '/api/v1/labels/check',
    '/api/v1/consignments/bulk-check',
    '/api/v1/gazette/parse',
    '/api/v1/alerts/feed',
    '/api/v1/calendar/',
    '/api/v1/qa/strict',
    '/api/v1/whatsapp/webhook',
    '/api/v1/widget/verify/',
    '/api/v1/self-audit/',
    '/api/v1/forecast/qco',
    '/api/v1/complaints/insights',
    '/api/v1/counterfeit/hotspots',
    '/api/v1/benchmark/',
    '/api/v1/risk/sector-heatmap',
    '/api/v1/dev/api-keys',
    '/api/v1/dev/webhooks',
    '/api/v1/supply-chain/trace',
    '/api/v1/escalations',
    '/api/v1/grievances',
    '/api/v1/indic/'
  ];

  const isBackendExtra = BACKEND_EXTRA_ROUTES.some(route => url.startsWith(route));
  const targetService = isBackendExtra ? (SERVICES['backend-extra'] || 'http://localhost:3005') : SERVICES['d1-chat'];

  // Forward request to appropriate upstream target
  proxyRequest(targetService, req, res);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[SAATHI gateway] Listening on port ${PORT}`);
    console.log(`[SAATHI gateway] Forwarding API requests → D1 at ${D1_URL}`);
    console.log(`[SAATHI gateway] Health endpoint: GET http://localhost:${PORT}/health`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SAATHI gateway] Service map: GET http://localhost:${PORT}/services`);
    }
  });
}

// ── Graceful shutdown ────────────────────────────────────────────────────────
function shutdown(signal) {
  console.log(`[SAATHI gateway] ${signal} received — shutting down`);
  server.close(() => {
    console.log('[SAATHI gateway] HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => { console.error('[SAATHI gateway] Forced exit after 10s'); process.exit(1); }, 10000);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

module.exports = { server, SERVICES, proxyRequest, pingService };
