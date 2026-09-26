const platformServices = require('../../p');

exports.getPlatformStatus = (req, res) => {
  res.json({
    status: 'ok',
    series: 'P-Series (Platform & Operations: P1 to P7)',
    activeModules: 7,
    timestamp: new Date().toISOString()
  });
};

exports.p1_login = (req, res) => {
  const result = platformServices.authenticateUser(req.body);
  res.json(result);
};

exports.p1_verify = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader ? authHeader.replace('Bearer ', '') : req.body.token;
  const result = platformServices.verifyToken(token);
  res.json(result);
};

exports.p2_checkRbac = (req, res) => {
  const { role, action, resource } = req.body;
  const result = platformServices.checkPermission(role, action, resource);
  res.json(result);
};

exports.p3_logEvent = (req, res) => {
  const { eventType, actor, details } = req.body;
  const result = platformServices.recordLog(eventType, actor, details);
  res.json(result);
};

exports.p3_getLogs = (req, res) => {
  const { limit } = req.query;
  const result = platformServices.getRecentLogs(limit ? parseInt(limit) : 20);
  res.json(result);
};

exports.p4_getHealth = (req, res) => {
  const result = platformServices.checkHealth();
  res.json(result);
};

exports.p5_createSandbox = (req, res) => {
  const { developerName, scope } = req.body;
  const result = platformServices.createSandboxApp(developerName, scope);
  res.json(result);
};

exports.p5_simulateWebhook = (req, res) => {
  const { webhookUrl, eventType } = req.body;
  const result = platformServices.simulateWebhookDispatch(webhookUrl, eventType);
  res.json(result);
};

exports.p6_getDrillStatus = (req, res) => {
  const result = platformServices.getDrillStatus();
  res.json(result);
};

exports.p6_triggerDrill = (req, res) => {
  const { region } = req.body;
  const result = platformServices.triggerSimulatedDrill(region);
  res.json(result);
};

exports.p7_getCitizenUptime = (req, res) => {
  const result = platformServices.getPublicStatus();
  res.json(result);
};
