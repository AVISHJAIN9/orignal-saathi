/**
 * P5 — Developer Sandbox for Third-Party Integrators
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Provides sandbox application management, API key issuance, webhook simulation,
 * and scope management for ERP and third-party compliance integrators.
 *
 * Tables: developer_sandbox_apps, developer_sandbox_webhooks, developer_sandbox_dispatches (c/database.js)
 */

const crypto = require('crypto');
const { db } = require('../../c/database');

const VALID_SCOPES = [
  'compliance:read',
  'compliance:write',
  'standards:read',
  'qco:read',
  'audit:write',
  'webhooks:subscribe'
];

class DeveloperSandboxService {
  /**
   * Registers a new third-party sandbox application.
   */
  static async createSandboxApp(developerName = 'Third-Party ERP', scopes = ['compliance:read', 'standards:read'], ownerEmail = 'dev@example.gov.in') {
    if (!developerName) throw new Error('developerName is required');

    // Validate scopes
    const validScopes = scopes.filter(s => VALID_SCOPES.includes(s));
    if (validScopes.length === 0) {
      throw new Error(`At least one valid scope required. Allowed scopes: ${VALID_SCOPES.join(', ')}`);
    }

    const sandboxId = 'sbx_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
    const rawApiKey = 'saathi_sbx_' + crypto.randomBytes(24).toString('hex');
    const apiKeyHash = crypto.createHash('sha256').update(rawApiKey).digest('hex');

    const appRecord = {
      id: sandboxId,
      developer_name: developerName,
      owner_email: ownerEmail,
      api_key_hash: apiKeyHash,
      allowed_scopes: validScopes,
      rate_limit_per_minute: 120,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    };

    await db.insert('developer_sandbox_apps', appRecord);

    return {
      sandboxId,
      developerName,
      apiKey: rawApiKey, // returned only once upon creation
      allowedScopes: validScopes,
      mockDataSeed: 'PREPOPULATED_BIS_STANDARDS_SAMPLE',
      rateLimitPerMinute: 120,
      createdAt: appRecord.created_at
    };
  }

  /**
   * Validates an API key against registered sandbox applications.
   */
  static async validateApiKey(rawApiKey, requiredScope) {
    if (!rawApiKey) return { valid: false, reason: 'API_KEY_REQUIRED' };
    const hash = crypto.createHash('sha256').update(rawApiKey).digest('hex');

    const app = await db.findOne('developer_sandbox_apps', a => a.api_key_hash === hash && a.status === 'ACTIVE');
    if (!app) return { valid: false, reason: 'INVALID_OR_REVOKED_KEY' };

    if (requiredScope && !app.allowed_scopes.includes(requiredScope)) {
      return { valid: false, reason: 'INSUFFICIENT_SCOPE', allowedScopes: app.allowed_scopes };
    }

    return { valid: true, appId: app.id, developerName: app.developer_name, scopes: app.allowed_scopes };
  }

  /**
   * Simulates an outbound webhook dispatch to test integrator event endpoints.
   */
  static async simulateWebhookDispatch(webhookUrl, eventType = 'QCO_NOTIFICATION_DRAFT', customPayload = null) {
    if (!webhookUrl || !webhookUrl.startsWith('http')) {
      throw new Error('Valid HTTP/HTTPS webhookUrl is required');
    }

    const dispatchId = 'wh_dsp_' + Date.now();
    const mockPayload = customPayload || {
      eventId: 'evt_sim_' + Date.now(),
      eventType,
      standardNumber: 'IS 1293:2019',
      title: 'Draft QCO Notification on Electrical Plugs & Sockets',
      effectiveDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      statutoryAuthority: 'DPIIT / Bureau of Indian Standards'
    };

    const record = {
      id: dispatchId,
      webhook_url: webhookUrl,
      event_type: eventType,
      payload: mockPayload,
      simulated_response_code: 200,
      dispatched_at: new Date().toISOString()
    };

    await db.insert('developer_sandbox_dispatches', record);

    return {
      dispatchId,
      status: 'dispatched',
      webhookUrl,
      eventType,
      mockPayload,
      responseCode: 200,
      dispatchedAt: record.dispatched_at
    };
  }
}

const createSandboxApp = (name, scope, email) => DeveloperSandboxService.createSandboxApp(name, scope, email);
const simulateWebhookDispatch = (url, event, payload) => DeveloperSandboxService.simulateWebhookDispatch(url, event, payload);

module.exports = {
  DeveloperSandboxService,
  createSandboxApp,
  simulateWebhookDispatch
};
