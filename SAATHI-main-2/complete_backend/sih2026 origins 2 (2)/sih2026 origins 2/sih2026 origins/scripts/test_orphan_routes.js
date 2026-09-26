/**
 * Orphan Route Direct-Invocation Test — Corrected Inputs
 * Uses valid inputs matching each service's actual business validation rules.
 */

'use strict';
process.env.LOCAL_DEV = 'true';
process.env.NODE_ENV = 'test';

const path = require('path');
const rootDir = path.resolve(__dirname, '..');

let lifecycleServices = {};
let platformServices = {};
let governanceServices = {};

try { lifecycleServices = require(path.join(rootDir, 's')); } catch (e) { console.error('s/ load error:', e.message); }
try { platformServices = require(path.join(rootDir, 'p')); } catch (e) { console.error('p/ load error:', e.message); }
try { governanceServices = require(path.join(rootDir, 'g')); } catch (e) { console.error('g/ load error:', e.message); }

let passed = 0;
let failed = 0;
const results = [];

async function test(id, route, fn) {
  try {
    const result = await fn();
    const ok = result !== null && result !== undefined;
    if (ok) {
      passed++;
      results.push({ id, route, status: 'PASS', result: JSON.stringify(result).slice(0, 200) });
    } else {
      failed++;
      results.push({ id, route, status: 'FAIL', result: 'returned null/undefined' });
    }
  } catch (err) {
    failed++;
    results.push({ id, route, status: 'FAIL', result: err.message });
  }
}

async function run() {
  console.log('\n==========================================================');
  console.log('🔬 Orphan Route Direct-Invocation Suite (Corrected Inputs)');
  console.log('==========================================================\n');

  // S44 — Digital Signage Feed (valid office)
  await test('S44', 'GET /lifecycle/s44/digital-signage?office=WRO_MUMBAI', async () => {
    return new lifecycleServices.DigitalSignageFeedService().getFeed('WRO_MUMBAI');
  });

  // G19 — Biometric Challenge
  await test('G19 challenge', 'POST /governance/g19/biometric/challenge {userId:"user-001"}', async () => {
    return governanceServices.BiometricAuthService.generateChallenge('user-001');
  });

  // G19 — Biometric Verify (invalid cred → service returns auth-failed status, not throws)
  await test('G19 verify', 'POST /governance/g19/biometric/verify {userId,challenge,credentialId}', async () => {
    const r = await governanceServices.BiometricAuthService.verifyBiometricCredential({
      userId: 'user-001', challenge: 'some-challenge', credentialId: 'cred-1'
    });
    // Any non-null response = service is wired and responding
    return r;
  });

  // G20 — SSO Exchange (correct portal name per validation)
  await test('G20 exchange', 'POST /governance/g20/sso/exchange {portal:"PARICHAY_MERIPEHCHAAN"}', async () => {
    return governanceServices.GovernmentSsoService.exchangeSsoToken({
      portal: 'PARICHAY_MERIPEHCHAAN',
      authCode: 'authcode_abc123',
      officialGovEmail: 'officer@gov.in',
      designation: 'Inspector',
      ministry: 'MeitY'
    });
  });

  // G20 — SSO Validate
  await test('G20 validate', 'GET /governance/g20/sso/session?sessionId=sess-abc', async () => {
    return governanceServices.GovernmentSsoService.validateSession('sess-abc');
  });

  // G22 — Welcome Tour
  await test('G22', 'GET /governance/g22/welcome-tour', async () => {
    if (governanceServices.getTourSteps) return governanceServices.getTourSteps({});
    return governanceServices.WelcomeTourService.getTourSteps({});
  });

  // P5 — Create Sandbox App (valid scopes)
  await test('P5 createApp', 'POST /platform/p5/sandbox/app {developerName,scopes,ownerEmail}', async () => {
    if (platformServices.createSandboxApp)
      return platformServices.createSandboxApp('Dev Naisarg', ['compliance:read', 'standards:read'], 'dev@saathi.in');
    return platformServices.DeveloperSandboxService.createSandboxApp(
      'Dev Naisarg', ['compliance:read', 'standards:read'], 'dev@saathi.in'
    );
  });

  // P5 — Simulate Webhook
  await test('P5 webhook', 'POST /platform/p5/sandbox/simulate-webhook', async () => {
    if (platformServices.simulateWebhookDispatch)
      return platformServices.simulateWebhookDispatch('https://webhook.site/test', 'application.status_changed', { appId: 'app-001' });
    return platformServices.DeveloperSandboxService.simulateWebhookDispatch(
      'https://webhook.site/test', 'application.status_changed', { appId: 'app-001' }
    );
  });

  // P6 — DR Drill Status
  await test('P6 status', 'GET /platform/p6/dr-status', async () => {
    if (platformServices.getDrillStatus) return platformServices.getDrillStatus();
    return platformServices.DisasterRecoveryDrillService.getDrillStatus();
  });

  // P6 — Trigger Drill (correct zone)
  await test('P6 trigger', 'POST /platform/p6/dr-trigger {targetRegion:"NIC-DELHI"}', async () => {
    if (platformServices.triggerSimulatedDrill) return platformServices.triggerSimulatedDrill('NIC-DELHI');
    return platformServices.DisasterRecoveryDrillService.triggerSimulatedDrill('NIC-DELHI');
  });

  // P7 — Uptime Status
  await test('P7', 'GET /platform/p7/uptime', async () => {
    if (platformServices.getPublicStatus) return platformServices.getPublicStatus();
    return platformServices.CitizenUptimeStatusService.getPublicStatus();
  });

  // Print results table
  console.log('\nREQUEST → RESPONSE RESULTS:');
  console.log('─'.repeat(110));
  for (const r of results) {
    const mark = r.status === 'PASS' ? '✅' : '❌';
    console.log(`${mark} [${r.id.padEnd(13)}] ${r.route}`);
    console.log(`   Response: ${r.result}\n`);
  }

  console.log('='.repeat(60));
  console.log(`📊 RESULT: ${passed}/${passed + failed} PASSED`);
  console.log('='.repeat(60));

  process.exit(failed > 0 ? 1 : 0);
}

run();
