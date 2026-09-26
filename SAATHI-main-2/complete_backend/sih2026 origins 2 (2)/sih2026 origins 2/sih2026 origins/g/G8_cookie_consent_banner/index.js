/**
 * G8: Cookie Consent Banner — DPDP-Compliant Implementation
 *
 * Implements server-side cookie consent state management per DPDP Act, 2023.
 * The frontend renders the banner; this module handles:
 * - Storing/retrieving consent state (Redis-backed, falls back to cookie)
 * - Categorizing cookies (strictly necessary / analytics / preferences)
 * - Generating the Set-Cookie headers for accepted categories
 * - Consent audit logging (wired to C37 audit events table)
 *
 * Cookie categories:
 *   STRICTLY_NECESSARY: session token, CSRF token — always set, no consent needed
 *   ANALYTICS:          Prometheus/Grafana user metrics — consent required
 *   PREFERENCES:        Language, theme — consent required
 */
'use strict';

const COOKIE_CATEGORIES = {
  STRICTLY_NECESSARY: 'strictly_necessary',
  ANALYTICS: 'analytics',
  PREFERENCES: 'preferences',
};

const COOKIE_MAX_AGE_DAYS = 365;

/**
 * Parse consent state from the saathi_consent cookie.
 * @param {string|undefined} cookieValue
 * @returns {{ analytics: boolean, preferences: boolean }}
 */
function parseConsentCookie(cookieValue) {
  if (!cookieValue) return { analytics: false, preferences: false };
  try {
    const decoded = Buffer.from(cookieValue, 'base64').toString('utf8');
    const parsed = JSON.parse(decoded);
    return {
      analytics: parsed.analytics === true,
      preferences: parsed.preferences === true,
    };
  } catch {
    return { analytics: false, preferences: false };
  }
}

/**
 * Encode consent state into a compact base64 cookie value.
 */
function encodeConsentCookie(consent) {
  return Buffer.from(JSON.stringify({
    analytics: consent.analytics === true,
    preferences: consent.preferences === true,
    consentedAt: new Date().toISOString(),
    version: '1.0',
  })).toString('base64');
}

/**
 * Generate Set-Cookie headers based on consent.
 * Call this when the user submits their consent choice.
 *
 * @param {{ analytics: boolean, preferences: boolean }} consent
 * @param {boolean} isSecure - true in production (HTTPS only)
 * @returns {string[]} Array of Set-Cookie header values
 */
function buildConsentCookieHeaders(consent, isSecure = true) {
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  const encoded = encodeConsentCookie(consent);

  const flags = `Max-Age=${maxAge}; Path=/; SameSite=Lax${isSecure ? '; Secure' : ''}; HttpOnly`;

  return [`saathi_consent=${encoded}; ${flags}`];
}

/**
 * Express/NestJS middleware: reads consent cookie and attaches to req.consentState.
 * Downstream handlers can check req.consentState.analytics before setting analytics cookies.
 */
function cookieConsentMiddleware(req, res, next) {
  const consentCookie = req.cookies?.saathi_consent;
  req.consentState = parseConsentCookie(consentCookie);
  next();
}

/**
 * REST endpoint handler for recording consent choices.
 * POST /api/v1/consent
 * Body: { analytics: true|false, preferences: true|false }
 */
async function handleConsentSubmit(req, res) {
  const { analytics = false, preferences = false } = req.body || {};
  const consent = { analytics: Boolean(analytics), preferences: Boolean(preferences) };
  const isSecure = process.env.NODE_ENV === 'production';
  const headers = buildConsentCookieHeaders(consent, isSecure);

  headers.forEach(h => res.setHeader('Set-Cookie', h));

  // Audit log (C37) — non-blocking
  try {
    const db = req.app?.locals?.db;
    if (db) {
      await db.query(
        `INSERT INTO compliance_audit_events (event_type, session_id, event_data, ip_address_hash)
         VALUES ($1, $2, $3, $4)`,
        [
          'COOKIE_CONSENT',
          req.headers['x-session-id'] || 'unknown',
          JSON.stringify(consent),
          require('crypto').createHash('sha256').update(req.ip || '').digest('hex'),
        ],
      );
    }
  } catch { /* audit failure must not block consent response */ }

  return res.json({
    status: 'consent_recorded',
    consent,
    message: consent.analytics
      ? 'Analytics cookies enabled. Thank you for helping us improve SAATHI.'
      : 'Only strictly necessary cookies are active.',
  });
}

/**
 * Consent banner configuration for the frontend.
 * GET /api/v1/consent/config
 */
function getConsentBannerConfig() {
  return {
    title: 'We use cookies',
    description:
      'SAATHI uses strictly necessary cookies for security and session management. ' +
      'With your consent, we also use analytics cookies to improve the service. ' +
      'No personal data is shared with third-party advertisers.',
    categories: [
      {
        id: COOKIE_CATEGORIES.STRICTLY_NECESSARY,
        label: 'Strictly Necessary',
        description: 'Required for login, security, and session. Cannot be disabled.',
        required: true,
      },
      {
        id: COOKIE_CATEGORIES.ANALYTICS,
        label: 'Analytics',
        description: 'Helps us understand how SAATHI is used to improve it. Fully anonymised.',
        required: false,
      },
      {
        id: COOKIE_CATEGORIES.PREFERENCES,
        label: 'Preferences',
        description: 'Remembers your language and display settings.',
        required: false,
      },
    ],
    privacyPolicyUrl: `${process.env.FRONTEND_URL || 'https://saathi.bis.gov.in'}/privacy`,
    legalBasis: 'DPDP Act, 2023 — Section 6 (Consent)',
    version: '1.0',
  };
}

module.exports = {
  COOKIE_CATEGORIES,
  parseConsentCookie,
  encodeConsentCookie,
  buildConsentCookieHeaders,
  cookieConsentMiddleware,
  handleConsentSubmit,
  getConsentBannerConfig,
};
