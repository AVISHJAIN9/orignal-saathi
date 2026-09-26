/**
 * G1: Homepage / Landing Page — Real API Data Provider
 *
 * Serves the landing page API endpoint with LIVE data pulled from the database:
 *   - Real document/chunk counts from bis_documents + document_chunks tables
 *   - Real active license count from license_status_records
 *   - Live service health status
 *   - Schema.org structured data for SEO
 *
 * Route: GET /api/v1/landing
 *
 * The frontend fetches this to hydrate the hero section stats.
 * Falls back gracefully to cached/estimated counts if DB is unreachable.
 */
'use strict';

const { toScriptTag, generateWebSiteSchema, generateGovernmentServiceSchema } = require('../G16_schema_markup');

// Cached stats (refreshed every 5 minutes; serves stale on DB error)
let statsCache = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

// Conservative fallback counts (from FEATURE_INVENTORY audit — do NOT hardcode growth numbers)
const FALLBACK_STATS = {
  totalStandardsIndexed: 0,        // 0 until real ingestion runs
  totalChunksIndexed: 0,
  activeLicenses: 0,
  certificationSchemes: 5,         // ISI, CRS, FMCS, Hallmarking, Ecomark — static
  supportedLanguages: 7,           // en, hi, mr, ta, te, kn, bn
  dataFreshness: 'Not yet indexed — run M1 crawler to populate',
};

/**
 * Get live homepage stats from the database.
 * @param {import('pg').Pool} pool - Postgres connection pool
 * @returns {Promise<object>}
 */
async function getLiveLandingStats(pool) {
  // Return cache if fresh
  if (statsCache && Date.now() < cacheExpiry) {
    return { ...statsCache, cached: true };
  }

  let stats;
  try {
    const [docsResult, chunksResult, licensesResult, freshResult] = await Promise.all([
      pool.query(`SELECT COUNT(*) AS count FROM bis_documents WHERE status = 'INDEXED'`),
      pool.query(`SELECT COUNT(*) AS count FROM document_chunks`),
      pool.query(`SELECT COUNT(*) AS count FROM license_status_records WHERE status = 'OPERATIVE_VALID'`),
      pool.query(`SELECT MAX(indexed_at) AS last_indexed FROM bis_documents WHERE status = 'INDEXED'`),
    ]);

    stats = {
      totalStandardsIndexed: parseInt(docsResult.rows[0]?.count || '0', 10),
      totalChunksIndexed: parseInt(chunksResult.rows[0]?.count || '0', 10),
      activeLicenses: parseInt(licensesResult.rows[0]?.count || '0', 10),
      certificationSchemes: 5,
      supportedLanguages: 7,
      dataFreshness: freshResult.rows[0]?.last_indexed
        ? new Date(freshResult.rows[0].last_indexed).toLocaleDateString('en-IN')
        : 'Not yet indexed',
      cached: false,
      fetchedAt: new Date().toISOString(),
    };

    // Update cache
    statsCache = stats;
    cacheExpiry = Date.now() + CACHE_TTL_MS;
  } catch (err) {
    // DB unreachable — serve fallback without crashing the landing page
    console.warn(`G1 landing stats DB error: ${err.message}. Serving fallback.`);
    stats = { ...FALLBACK_STATS, cached: false, error: 'DB temporarily unavailable' };
  }

  return stats;
}

/**
 * Full landing page API response.
 * @param {import('pg').Pool} pool
 * @returns {Promise<object>}
 */
async function getLandingData(pool) {
  const stats = await getLiveLandingStats(pool);

  return {
    meta: {
      title: 'SAATHI — BIS Compliance Intelligence Platform',
      description:
        'AI-powered compliance assistant for Indian manufacturers and importers. ' +
        'Standards lookup, QCO applicability, ISI certification guidance, hallmarking, and more.',
      keywords: [
        'BIS standards', 'ISI certification', 'QCO', 'Quality Control Order',
        'hallmarking', 'CRS scheme', 'FMCS', 'Indian standards', 'BIS compliance',
        'MSME certification',
      ],
      schemaMarkup: [generateWebSiteSchema(), generateGovernmentServiceSchema()],
    },
    hero: {
      headline: 'SAATHI — Your BIS Compliance Intelligence Partner',
      subheadline:
        'Instant, AI-powered answers about BIS standards, Quality Control Orders, ' +
        'ISI certification, hallmarking, and laboratory testing — grounded in real BIS documents.',
      ctaText: 'Start Your Compliance Query',
      ctaUrl: '/chat',
    },
    stats,
    features: [
      {
        icon: 'search',
        title: 'Standards Lookup',
        description: 'Find applicable Indian Standards (IS) for any product in seconds.',
      },
      {
        icon: 'shield',
        title: 'QCO Applicability',
        description: 'Instantly check if your product is covered under a Quality Control Order.',
      },
      {
        icon: 'certificate',
        title: 'Certification Guidance',
        description: 'Step-by-step guidance for ISI, CRS, FMCS, and Hallmarking schemes.',
      },
      {
        icon: 'map',
        title: 'Lab Finder',
        description: 'Locate BIS-empanelled testing laboratories near your factory.',
      },
      {
        icon: 'globe',
        title: 'Multilingual',
        description: 'Available in Hindi, Marathi, Tamil, Telugu, Kannada, and Bengali.',
      },
      {
        icon: 'msme',
        title: 'MSME Focused',
        description: 'Simplified guidance designed for small and medium manufacturers.',
      },
    ],
    certificationSchemes: [
      { id: 'ISI', name: 'ISI Mark (Scheme I)', products: 'Industrial & consumer goods' },
      { id: 'CRS', name: 'Compulsory Registration Scheme', products: 'Electronics & IT products' },
      { id: 'FMCS', name: 'Foreign Manufacturers Certification', products: 'Imported goods' },
      { id: 'HALLMARKING', name: 'Hallmarking', products: 'Gold & silver jewellery' },
      { id: 'ECOMARK', name: 'Ecomark', products: 'Eco-friendly products' },
    ],
    legalDisclaimer:
      'SAATHI provides general compliance information based on publicly available BIS documents. ' +
      'It does not constitute legal advice or an official BIS determination. ' +
      'Always verify critical decisions at www.bis.gov.in.',
    timestamp: new Date().toISOString(),
  };
}

module.exports = { getLandingData, getLiveLandingStats, FALLBACK_STATS };
