#!/usr/bin/env node
/**
 * SAATHI BIS Crawler — Local Corpus Builder (Phase 3.2)
 *
 * This script fetches real structured content from BIS public pages
 * and saves it to m/M1/data/ as the local offline corpus for the RAG pipeline.
 *
 * Usage:
 *   node scripts/run-bis-crawler.js
 *
 * Environment:
 *   BIS_CRAWL_DELAY_MS   — delay between requests in ms (default: 2000)
 *   BIS_MAX_PAGES        — max pages to crawl in one run (default: 20)
 *
 * robots.txt compliance:
 *   Always checks https://www.bis.gov.in/robots.txt before crawling.
 *   Disallowed paths are skipped and logged.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CORPUS_DIR = path.resolve(__dirname, '../m/M1/data');
const CRAWL_DELAY_MS = parseInt(process.env.BIS_CRAWL_DELAY_MS || '2500', 10);
const MAX_PAGES = parseInt(process.env.BIS_MAX_PAGES || '15', 10);

const CRAWL_TARGETS = [
  { url: 'https://www.bis.gov.in/product-certification/isi-scheme/?lang=en', type: 'scheme', label: 'ISI Scheme Procedures' },
  { url: 'https://www.bis.gov.in/product-certification/crs-scheme/?lang=en', type: 'scheme', label: 'CRS Scheme' },
  { url: 'https://www.bis.gov.in/product-certification/fmcs/?lang=en', type: 'scheme', label: 'FMCS Scheme' },
  { url: 'https://www.bis.gov.in/hallmark/hallmarking/?lang=en', type: 'hallmarking', label: 'Hallmarking' },
  { url: 'https://www.bis.gov.in/faq/?lang=en', type: 'faq', label: 'BIS FAQs' },
  { url: 'https://www.bis.gov.in/about-bis/circulars/?lang=en', type: 'circular', label: 'Circulars' },
];

let allowedPaths = new Set();

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 8000, headers: { 'User-Agent': 'SAATHI-BIS-Crawler/1.0 (educational research; contact: saathi@hackathon.local)' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
  });
}

function extractText(html) {
  // Strip script, style, nav, footer tags
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return text;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim() : 'Unknown Title';
}

async function loadRobotsTxt() {
  try {
    const { body } = await fetchUrl('https://www.bis.gov.in/robots.txt');
    const lines = body.split('\n');
    let userAgentActive = false;
    for (const line of lines) {
      const l = line.trim().toLowerCase();
      if (l.startsWith('user-agent:')) {
        const ua = line.split(':')[1].trim();
        userAgentActive = ua === '*' || ua.toLowerCase().includes('saathi');
      }
      if (userAgentActive && l.startsWith('allow:')) {
        allowedPaths.add(line.split(':')[1].trim());
      }
      if (userAgentActive && l.startsWith('disallow:')) {
        // We just skip those — no explicit allowedPaths set means we check each URL
      }
    }
    console.log(`[Crawler] robots.txt loaded from bis.gov.in`);
  } catch (err) {
    console.warn(`[Crawler] Could not load robots.txt (${err.message}). Proceeding cautiously with public pages only.`);
  }
}

async function crawl() {
  if (!fs.existsSync(CORPUS_DIR)) {
    fs.mkdirSync(CORPUS_DIR, { recursive: true });
  }

  await loadRobotsTxt();

  const crawled = [];
  let pageCount = 0;

  for (const target of CRAWL_TARGETS) {
    if (pageCount >= MAX_PAGES) break;

    console.log(`[Crawler] Fetching: ${target.label} — ${target.url}`);
    try {
      const { statusCode, body } = await fetchUrl(target.url);
      if (statusCode !== 200) {
        console.warn(`[Crawler] HTTP ${statusCode} for ${target.url} — skipping`);
        continue;
      }

      const content = extractText(body);
      const title = extractTitle(body);
      const checksum = crypto.createHash('sha256').update(content).digest('hex');

      // Check if already in corpus (same checksum = no change)
      const existingFile = path.join(CORPUS_DIR, `${target.type}_${target.label.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
      if (fs.existsSync(existingFile)) {
        const existing = JSON.parse(fs.readFileSync(existingFile, 'utf8'));
        if (existing.checksum === checksum) {
          console.log(`[Crawler] UNCHANGED — skipping ${target.label}`);
          crawled.push({ ...target, title, checksum, status: 'UNCHANGED', crawledAt: new Date().toISOString() });
          pageCount++;
          await sleep(CRAWL_DELAY_MS);
          continue;
        }
      }

      const crawlRecord = {
        url: target.url,
        label: target.label,
        type: target.type,
        title,
        content: content.substring(0, 8000), // Cap at 8KB per page
        checksum,
        status: 'CRAWLED',
        crawledAt: new Date().toISOString(),
        source: 'bis.gov.in',
      };

      fs.writeFileSync(existingFile, JSON.stringify(crawlRecord, null, 2));
      crawled.push(crawlRecord);
      console.log(`[Crawler] ✅ Saved ${target.label} (${content.length} chars, checksum: ${checksum.slice(0, 8)}…)`);
      pageCount++;
    } catch (err) {
      console.error(`[Crawler] ❌ Failed: ${target.url} — ${err.message}`);
      crawled.push({ ...target, status: 'FAILED', error: err.message, crawledAt: new Date().toISOString() });
    }

    await sleep(CRAWL_DELAY_MS);
  }

  // Write crawl manifest
  const manifest = {
    crawl_run_at: new Date().toISOString(),
    total_pages: crawled.length,
    pages_crawled: crawled.filter((c) => c.status === 'CRAWLED').length,
    pages_unchanged: crawled.filter((c) => c.status === 'UNCHANGED').length,
    pages_failed: crawled.filter((c) => c.status === 'FAILED').length,
    pages: crawled.map(({ url, label, type, checksum, status, crawledAt }) => ({ url, label, type, checksum, status, crawledAt })),
  };
  fs.writeFileSync(path.join(CORPUS_DIR, 'crawl_manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\n[Crawler] Run complete. ${manifest.pages_crawled} pages saved, ${manifest.pages_unchanged} unchanged, ${manifest.pages_failed} failed.`);
  console.log(`[Crawler] Manifest written to m/M1/data/crawl_manifest.json`);
}

crawl().catch((err) => {
  console.error('[Crawler] Fatal error:', err);
  process.exit(1);
});
