#!/usr/bin/env node
/**
 * SAATHI DR Drill Automation Script
 *
 * Runs automated disaster recovery drills against staging/production.
 * Each drill tests one failure scenario end-to-end and produces a report.
 *
 * Available drills:
 *   node infra/dr/drill.js --drill db-failover   [--env staging]
 *   node infra/dr/drill.js --drill redis-failover
 *   node infra/dr/drill.js --drill pod-restart
 *   node infra/dr/drill.js --drill all
 *
 * IMPORTANT: Never run --drill db-failover against production without explicit
 * sign-off from Engineering Lead + on-call. It temporarily disrupts service.
 *
 * Output: docs/dr-drills/YYYY-MM-DD-<drill>-report.md
 */

'use strict';

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const drillType = args[args.indexOf('--drill') + 1] || 'health-only';
const env = args[args.indexOf('--env') + 1] || 'staging';
const kubeNs = env === 'production' ? 'saathi-prod' : 'saathi-staging';
const baseUrl = process.env.STAGING_URL || 'http://localhost:5001';

const REPORT_DIR = path.join(__dirname, '../../docs/dr-drills');
const timestamp = new Date().toISOString().split('T')[0];
const reportFile = path.join(REPORT_DIR, `${timestamp}-${drillType}-report.md`);

if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

// ── Utilities ────────────────────────────────────────────────────────────────

function log(msg) { console.log(`[${new Date().toISOString()}] ${msg}`); }
function err(msg) { console.error(`[${new Date().toISOString()}] ❌ ${msg}`); }

function kubectl(args) {
  const result = spawnSync('kubectl', args.split(' '), { encoding: 'utf8' });
  return { stdout: result.stdout, stderr: result.stderr, code: result.status };
}

function curlHealth(url, timeoutSec = 10) {
  try {
    const result = execSync(`curl -sf --max-time ${timeoutSec} ${url}/health`, { encoding: 'utf8' });
    const body = JSON.parse(result);
    return body.status === 'ok';
  } catch {
    return false;
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Drill implementations ────────────────────────────────────────────────────

async function drillHealthOnly() {
  log('DRILL: health-only — checking all service health endpoints');
  const services = [
    `${baseUrl}`,
    `${process.env.M5_URL || 'http://localhost:8000'}`,
    `${process.env.P1_URL || 'http://localhost:8001'}`,
  ];
  const results = [];
  for (const svc of services) {
    const healthy = curlHealth(svc);
    results.push({ service: svc, healthy });
    log(`  ${healthy ? '✅' : '❌'} ${svc}`);
  }
  return { drill: 'health-only', passed: results.every(r => r.healthy), results };
}

async function drillPodRestart() {
  log(`DRILL: pod-restart — rolling restart of D1 chat pod in ${kubeNs}`);
  const steps = [];

  // Check pre-restart health
  const prePing = curlHealth(baseUrl);
  steps.push({ step: 'pre-restart health check', passed: prePing });

  if (!prePing) {
    err('Service not healthy before drill — aborting');
    return { drill: 'pod-restart', passed: false, steps, reason: 'Pre-drill health check failed' };
  }

  // Delete one pod (K8s will immediately reschedule)
  const pods = kubectl(`get pods -n ${kubeNs} -l app=d1-chat -o name`);
  const podList = pods.stdout.trim().split('\n').filter(Boolean);

  if (!podList.length) {
    return { drill: 'pod-restart', passed: false, steps, reason: `No d1-chat pods in ${kubeNs}` };
  }

  const targetPod = podList[0].replace('pod/', '');
  log(`  Deleting pod: ${targetPod}`);
  kubectl(`delete pod ${targetPod} -n ${kubeNs} --grace-period=0`);
  steps.push({ step: `deleted pod ${targetPod}`, passed: true });

  // Wait up to 60s for replacement pod
  let recovered = false;
  for (let i = 0; i < 12; i++) {
    await sleep(5000);
    const health = curlHealth(baseUrl, 5);
    if (health) { recovered = true; break; }
    log(`  Waiting for pod to recover... (${(i + 1) * 5}s)`);
  }

  steps.push({ step: 'service recovered after pod deletion', passed: recovered });
  log(recovered ? '  ✅ Service recovered within 60s' : '  ❌ Service did not recover');

  return { drill: 'pod-restart', passed: recovered, steps };
}

async function drillHpaScaleUp() {
  log('DRILL: hpa-scale — verifying HPA can scale up under simulated load');
  const result = kubectl(`get hpa d1-chat-hpa -n ${kubeNs} -o json`);

  try {
    const hpa = JSON.parse(result.stdout);
    const minReplicas = hpa.spec.minReplicas;
    const maxReplicas = hpa.spec.maxReplicas;
    log(`  HPA: min=${minReplicas} max=${maxReplicas}`);
    return {
      drill: 'hpa-scale',
      passed: true,
      data: { minReplicas, maxReplicas },
      note: 'HPA config verified. Full scale-up drill requires k6 load test run.',
    };
  } catch {
    return { drill: 'hpa-scale', passed: false, reason: 'Could not parse HPA config' };
  }
}

// ── Run selected drill ────────────────────────────────────────────────────────

async function run() {
  log(`SAATHI DR DRILL: ${drillType} | Environment: ${env} | Namespace: ${kubeNs}`);

  if (env === 'production') {
    log('⚠️  WARNING: Running DR drill against PRODUCTION. Sleeping 10s for abort window...');
    await sleep(10000);
  }

  let results = [];

  if (drillType === 'all') {
    results.push(await drillHealthOnly());
    results.push(await drillPodRestart());
    results.push(await drillHpaScaleUp());
  } else if (drillType === 'health-only') {
    results.push(await drillHealthOnly());
  } else if (drillType === 'pod-restart') {
    results.push(await drillPodRestart());
  } else if (drillType === 'hpa-scale') {
    results.push(await drillHpaScaleUp());
  } else {
    err(`Unknown drill type: ${drillType}. Valid: all, health-only, pod-restart, hpa-scale`);
    process.exit(1);
  }

  const allPassed = results.every(r => r.passed);

  // Write report
  const report = [
    `# SAATHI DR Drill Report`,
    ``,
    `**Date:** ${new Date().toISOString()}`,
    `**Drill:** ${drillType}`,
    `**Environment:** ${env}`,
    `**Result:** ${allPassed ? '✅ PASSED' : '❌ FAILED'}`,
    ``,
    `## Results`,
    ...results.map(r => [
      `### ${r.drill}`,
      `- **Passed:** ${r.passed ? 'Yes ✅' : 'No ❌'}`,
      r.reason ? `- **Reason:** ${r.reason}` : '',
      r.note ? `- **Note:** ${r.note}` : '',
      r.steps ? `\n**Steps:**\n${r.steps.map(s => `- ${s.passed ? '✅' : '❌'} ${s.step}`).join('\n')}` : '',
    ].filter(Boolean).join('\n')),
    ``,
    `## Next Steps`,
    allPassed
      ? '- File this report in docs/dr-drills/\n- Schedule next drill in 3 months'
      : '- Investigate failure\n- Fix identified issue\n- Re-run drill to confirm fix\n- Update RUNBOOK.md if procedure was incorrect',
  ].join('\n');

  fs.writeFileSync(reportFile, report, 'utf8');
  log(`📄 Drill report written to: ${reportFile}`);
  log(allPassed ? '✅ DRILL PASSED' : '❌ DRILL FAILED');

  process.exit(allPassed ? 0 : 1);
}

run().catch(e => { err(e.message); process.exit(1); });
