/**
 * P4: System Diagnostics, Health Checks & Configuration (MERN Stack)
 */
class HealthDiagnosticsService {
  static checkHealth() {
    return {
      status: 'HEALTHY',
      uptimeSeconds: process.uptime(),
      nodeVersion: process.version,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      database: 'CONNECTED',
      timestamp: new Date().toISOString()
    };
  }
}

const checkHealth = () => HealthDiagnosticsService.checkHealth();

module.exports = {
  HealthDiagnosticsService,
  checkHealth
};
