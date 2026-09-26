/**
 * G15: 404 Error Handler — Real Implementation
 *
 * Provides a structured 404 handler for all SAATHI NestJS services.
 * Returns consistent JSON (for API routes) or redirects to the frontend 404 page.
 *
 * Usage in NestJS main.ts:
 *   import { setupNotFoundHandler } from '../../../g/G15_404_error_page';
 *   const app = await NestFactory.create(AppModule);
 *   setupNotFoundHandler(app);
 *
 * Usage standalone with Express:
 *   app.use(notFoundHandler);
 */
'use strict';

/**
 * NestJS global 404 handler.
 * Call after all routes are registered.
 */
function setupNotFoundHandler(app) {
  const express = require('@nestjs/platform-express').ExpressAdapter || null;
  const httpAdapter = app.getHttpAdapter();
  const expressApp = httpAdapter.getInstance();

  expressApp.use((req, res, next) => {
    const isApiRoute = req.path.startsWith('/api/');

    if (isApiRoute) {
      return res.status(404).json({
        statusCode: 404,
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} does not exist in SAATHI API`,
        timestamp: new Date().toISOString(),
        docs: 'https://saathi.bis.gov.in/api/docs',
        suggestion: req.path.includes('/standards/')
          ? 'For standards lookup, use GET /api/v1/standards?query=<term>'
          : req.path.includes('/chat')
          ? 'For RAG chat, use POST /api/v1/chat'
          : undefined,
      });
    }

    // Non-API routes: redirect to frontend 404 page
    const frontendUrl = process.env.FRONTEND_URL || 'https://saathi.bis.gov.in';
    res.redirect(`${frontendUrl}/404?from=${encodeURIComponent(req.path)}`);
  });
}

/**
 * Standalone Express 404 middleware.
 */
function notFoundHandler(req, res, next) {
  const isApiRoute = req.path.startsWith('/api/');
  if (isApiRoute) {
    return res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${req.method} ${req.path} not found`,
      timestamp: new Date().toISOString(),
    });
  }
  next();
}

module.exports = { setupNotFoundHandler, notFoundHandler };
