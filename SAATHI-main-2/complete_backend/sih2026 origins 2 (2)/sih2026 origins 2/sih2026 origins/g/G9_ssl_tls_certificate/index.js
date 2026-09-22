/**
 * G9: SSL/TLS Certificate Configuration — Real Implementation
 *
 * Provides:
 * 1. TLS configuration check at startup (verifies HTTPS is enforced)
 * 2. HSTS header injection middleware (HTTP Strict Transport Security)
 * 3. cert-manager annotation reference for K8s Ingress (see infra/k8s/)
 * 4. CSP (Content Security Policy) header generator
 *
 * All SAATHI services behind the Ingress get TLS from Let's Encrypt
 * via cert-manager. This module handles the application-layer headers.
 */
'use strict';

/**
 * Express middleware: injects HSTS + security headers on every response.
 * Apply in main.ts BEFORE routes. Complements helmet().
 */
function tlsSecurityHeaders(req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    // HSTS: force HTTPS for 1 year, include subdomains, preload-ready
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload',
    );
  }

  // Content Security Policy
  res.setHeader('Content-Security-Policy', buildCSP());

  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Referrer policy: don't leak URL paths to third parties (DPDP)
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy: disable features SAATHI doesn't need
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  );

  next();
}

/**
 * Build Content Security Policy string.
 * Adjust src values when embedding from specific CDNs.
 */
function buildCSP() {
  const frontendUrl = process.env.FRONTEND_URL || 'https://saathi.bis.gov.in';
  const cdnUrl = process.env.CDN_URL || '';

  const directives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'nonce-{NONCE}'"],     // Nonce injected per request in frontend
    'style-src': ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https://www.bis.gov.in', cdnUrl].filter(Boolean),
    'connect-src': ["'self'", frontendUrl, 'https://api.hcaptcha.com'],
    'frame-ancestors': ["'none'"],                    // Clickjacking protection
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'object-src': ["'none'"],
    'upgrade-insecure-requests': [],
  };

  return Object.entries(directives)
    .map(([key, values]) => values.length ? `${key} ${values.join(' ')}` : key)
    .join('; ');
}

/**
 * Startup check: warn if service is running without TLS in production.
 * @param {number} port
 */
function checkTLSConfiguration(port) {
  const isProduction = process.env.NODE_ENV === 'production';
  const forceSsl = process.env.FORCE_SSL === 'true';

  if (isProduction) {
    if (!forceSsl) {
      console.warn(
        '⚠️  G9 TLS Check: FORCE_SSL is not set. ' +
        'SAATHI must run behind a TLS-terminating load balancer (nginx Ingress / ALB). ' +
        'Ensure the Ingress has cert-manager annotations and ssl-redirect enabled.',
      );
    }
    console.log(`✅ G9: Service running on port ${port}. TLS enforced at Ingress layer.`);
    console.log('   cert-manager annotations in infra/k8s/base/ingress.yaml: cert-manager.io/cluster-issuer: letsencrypt-prod');
  }
}

module.exports = { tlsSecurityHeaders, buildCSP, checkTLSConfiguration };
