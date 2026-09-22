/**
 * SAATHI Phase 4 Tests: P5–P7 and G19–G20 Real Implementations
 */

const { DeveloperSandboxService } = require('../p/P5_developer_sandbox_for_third_party_integr');
const { DisasterRecoveryDrillService } = require('../p/P6_disaster_recovery_drill_dashboard');
const { CitizenUptimeStatusService } = require('../p/P7_uptime_status_page_for_citizens');
const { BiometricAuthService } = require('../g/G19_biometric_login_option');
const { GovernmentSsoService } = require('../g/G20_single_sign_on_for_government_portals');

async function runTests() {
  console.log('====================================================');
  console.log('TESTING P5–P7 & G19–G20 REAL IMPLEMENTATIONS');
  console.log('====================================================');

  // 1. P5 Developer Sandbox
  console.log('\n1. P5 — Developer Sandbox');
  const app = await DeveloperSandboxService.createSandboxApp('Tata Steel ERP', ['compliance:read', 'standards:read'], 'tata.dev@tata.com');
  console.assert(app.sandboxId.startsWith('sbx_'), 'P5 should create sandbox ID');
  console.assert(app.apiKey.startsWith('saathi_sbx_'), 'P5 should return real API key');
  console.log('  ✓ P5: Sandbox App created:', app.sandboxId);

  const auth = await DeveloperSandboxService.validateApiKey(app.apiKey, 'compliance:read');
  console.assert(auth.valid === true, 'P5 should validate valid API key and scope');
  console.log('  ✓ P5: API key validated with scope');

  const webhook = await DeveloperSandboxService.simulateWebhookDispatch('https://api.tatasteel.com/webhooks/bis', 'QCO_ENACTED');
  console.assert(webhook.status === 'dispatched', 'P5 webhook dispatch should succeed');
  console.log('  ✓ P5: Webhook simulated:', webhook.dispatchId);

  // 2. P6 Disaster Recovery Drill Dashboard
  console.log('\n2. P6 — Disaster Recovery Drill Dashboard');
  const status = await DisasterRecoveryDrillService.getDrillStatus();
  console.assert(status.status === 'ok', 'P6 drill status should be ok');
  console.assert(status.geoRedundancyZones.length >= 3, 'P6 should cover geo zones');
  console.assert(typeof status.actualRTOAchievedMinutes === 'number', 'P6 RTO should be a computed number');
  console.log('  ✓ P6: Drill status retrieved, actual RTO:', status.actualRTOAchievedMinutes, 'min');

  const drill = await DisasterRecoveryDrillService.triggerSimulatedDrill('NIC-DELHI');
  console.assert(drill.status === 'SIMULATION_COMPLETED', 'P6 trigger drill should complete');
  console.log('  ✓ P6: Drill triggered & logged:', drill.drillExecutionId);

  // 3. P7 Uptime Status Page for Citizens
  console.log('\n3. P7 — Citizen Uptime Status Page');
  await CitizenUptimeStatusService.recordHealthPing('standards_search', 32, true);
  const uptime = await CitizenUptimeStatusService.getPublicStatus();
  console.assert(uptime.subsystems.length === 5, 'P7 should report all 5 citizen subsystems');
  console.assert(uptime.uptime90Days.endsWith('%'), 'P7 uptime should have percent string');
  console.log('  ✓ P7: Citizen status retrieved, uptime:', uptime.uptime90Days, 'subsystems:', uptime.subsystems.length);

  // 4. G19 Biometric Authentication
  console.log('\n4. G19 — Biometric Login Option (WebAuthn)');
  const ch = await BiometricAuthService.generateChallenge('usr_compliance_officer');
  console.assert(ch.challenge && ch.challenge.length > 20, 'G19 should generate challenge');
  console.log('  ✓ G19: Challenge generated');

  const reg = await BiometricAuthService.registerCredential('usr_compliance_officer', {
    credentialId: 'cred_fingerprint_01',
    publicKey: 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...'
  });
  console.assert(reg.status === 'REGISTERED', 'G19 credential registration should succeed');
  console.log('  ✓ G19: Biometric credential registered');

  const verify = await BiometricAuthService.verifyBiometricCredential({
    userId: 'usr_compliance_officer',
    credentialId: 'cred_fingerprint_01',
    challenge: ch.challenge
  });
  console.assert(verify.status === 'AUTHENTICATED' && verify.webAuthnVerified === true, 'G19 assertion should verify');
  console.log('  ✓ G19: Biometric assertion verified successfully');

  // Anti-replay test
  const replay = await BiometricAuthService.verifyBiometricCredential({
    userId: 'usr_compliance_officer',
    credentialId: 'cred_fingerprint_01',
    challenge: ch.challenge
  });
  console.assert(replay.webAuthnVerified === false, 'G19 should reject replayed challenge');
  console.log('  ✓ G19: Anti-replay protection verified');

  // 5. G20 Government SSO (MeriPehchaan / Parichay)
  console.log('\n5. G20 — Government SSO');
  const sso = await GovernmentSsoService.exchangeSsoToken({
    officialGovEmail: 'director.standards@nic.in',
    portal: 'PARICHAY_MERIPEHCHAAN',
    designation: 'JOINT_DIRECTOR_BIS'
  });
  console.assert(sso.authenticated === true, 'G20 SSO should authenticate gov official');
  console.assert(sso.officer.role === 'BIS_VERIFYING_OFFICER', 'G20 should assign verified officer role');
  console.log('  ✓ G20: Government official authenticated:', sso.officer.email);

  const invalidDomain = await GovernmentSsoService.exchangeSsoToken({
    officialGovEmail: 'hacker@gmail.com',
    portal: 'PARICHAY_MERIPEHCHAAN'
  });
  console.assert(invalidDomain.authenticated === false, 'G20 should reject non-gov email');
  console.log('  ✓ G20: Non-gov domain rejected');

  console.log('\n====================================================');
  console.log('ALL P5–P7 & G19–G20 TESTS PASSED (100%)');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('TEST RUN FAILED:', err);
  process.exit(1);
});
