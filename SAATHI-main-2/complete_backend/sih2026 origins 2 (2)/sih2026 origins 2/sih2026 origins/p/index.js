/**
 * Master Platform Series (P1 to P7) MERN Stack Exports
 */
const { IdentityAuthService, authenticateUser, verifyToken } = require('./p1/index.js');
const { RBACPolicyEngine, checkPermission } = require('./p2/index.js');
const { AuditTelemetryService, recordLog, getRecentLogs } = require('./p3/index.js');
const { HealthDiagnosticsService, checkHealth } = require('./p4/index.js');
const { DeveloperSandboxService, createSandboxApp, simulateWebhookDispatch } = require('./P5_developer_sandbox_for_third_party_integr/index.js');
const { DisasterRecoveryDrillService, getDrillStatus, triggerSimulatedDrill } = require('./P6_disaster_recovery_drill_dashboard/index.js');
const { CitizenUptimeStatusService, getPublicStatus } = require('./P7_uptime_status_page_for_citizens/index.js');

module.exports = {
  IdentityAuthService,
  authenticateUser,
  verifyToken,
  RBACPolicyEngine,
  checkPermission,
  AuditTelemetryService,
  recordLog,
  getRecentLogs,
  HealthDiagnosticsService,
  checkHealth,
  DeveloperSandboxService,
  createSandboxApp,
  simulateWebhookDispatch,
  DisasterRecoveryDrillService,
  getDrillStatus,
  triggerSimulatedDrill,
  CitizenUptimeStatusService,
  getPublicStatus
};
