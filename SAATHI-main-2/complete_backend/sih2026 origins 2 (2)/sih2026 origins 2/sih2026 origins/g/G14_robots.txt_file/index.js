/**
 * G14: robots.txt Generator — Real Implementation
 *
 * Generates a valid robots.txt for bis.gov.in/saathi.bis.gov.in
 * that is actually served at GET /robots.txt
 *
 * Rules:
 * - Allow search engine indexing of public help/standards pages
 * - Block admin, API, queues, and internal dashboards
 * - Set polite crawl delay for third-party bots
 * - Identify SAATHI's own crawler (BisCrawlerService uses this User-agent)
 */
'use strict';

const SITEMAP_URL = process.env.SITEMAP_URL || 'https://saathi.bis.gov.in/sitemap.xml';

/**
 * Generate the robots.txt content.
 * @returns {string} Valid robots.txt string
 */
function generateRobotsTxt() {
  return `# SAATHI BIS Compliance Assistant — robots.txt
# https://saathi.bis.gov.in
# Generated: ${new Date().toUTCString()}

# ── SAATHI's own crawler (always allowed, polite crawl delay) ──────────────
User-agent: SAATHI-BIS-Crawler
Allow: /
Crawl-delay: 2

# ── Search Engines ─────────────────────────────────────────────────────────
User-agent: Googlebot
User-agent: Bingbot
User-agent: DuckDuckBot
Allow: /help/
Allow: /standards/
Allow: /about/
Allow: /faq/
Disallow: /api/
Disallow: /admin/
Disallow: /auth/
Disallow: /metrics
Disallow: /health
Disallow: /admin/queues
Disallow: /*.env
Disallow: /*.json$

# ── All other bots ─────────────────────────────────────────────────────────
User-agent: *
Allow: /help/
Allow: /standards/
Allow: /about/
Disallow: /api/
Disallow: /admin/
Disallow: /auth/
Disallow: /admin/queues
Disallow: /metrics
Crawl-delay: 5

# Sitemap
Sitemap: ${SITEMAP_URL}
`;
}

/**
 * Express/NestJS middleware to serve robots.txt at /robots.txt
 * Mount with: app.use(robotsTxtMiddleware)
 */
function robotsTxtMiddleware(req, res, next) {
  if (req.path === '/robots.txt') {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=86400'); // Cache 24 hours
    return res.send(generateRobotsTxt());
  }
  next();
}

module.exports = { generateRobotsTxt, robotsTxtMiddleware };
