/**
 * C4 — Application Readiness Score
 * Tables: readiness_scores, readiness_blockers, readiness_history
 * Logic: Deterministic scoring algorithm evaluating completeness of prerequisites
 * (lab testing, factory QC setup, documentation, statutory undertakings).
 */

const { db } = require('../database');

class ApplicationReadinessCalculator {
  async calculateScore(checklistArg, applicantIdArg) {
    let checklist = {};
    let applicantId = 'applicant_default';
    let standardNumber = 'IS 269:2015';

    if (typeof checklistArg === 'object' && checklistArg !== null) {
      if (checklistArg.checklist) {
        checklist = checklistArg.checklist;
        applicantId = checklistArg.applicantId || checklistArg.applicant_id || applicantId;
        standardNumber = checklistArg.standardNumber || checklistArg.standard_number || standardNumber;
      } else {
        checklist = checklistArg;
      }
    }
    if (applicantIdArg) {
      applicantId = applicantIdArg;
    }

    // Four core dimensions and weights:
    // 1. Lab Testing (35%)
    // 2. Factory Quality Control Setup (25%)
    // 3. Technical & Legal Documentation (25%)
    // 4. Statutory Undertakings & Fees (15%)
    const dimensionWeights = {
      testing: 35,
      factoryQc: 25,
      documentation: 25,
      statutory: 15
    };

    const blockers = [];

    // Evaluate testing (35 points)
    let testingScore = 0;
    if (checklist.nablTestReportUploaded || checklist.testReports) {
      testingScore += 25;
    } else {
      blockers.push({
        category: 'TESTING',
        severity: 'BLOCKER',
        blocker_description: 'Independent NABL / BIS accredited laboratory test report is missing.',
        required_action: 'Upload completed test report from an accredited lab covering all mandatory clauses.'
      });
    }
    if (checklist.inHouseTestRecords) {
      testingScore += 10;
    } else {
      blockers.push({
        category: 'TESTING',
        severity: 'WARNING',
        blocker_description: 'In-house routine test logsheets covering the last 30 days are not submitted.',
        required_action: 'Attach routine test register logsheets as required by SIT.'
      });
    }

    // Evaluate factory QC (25 points)
    let factoryScore = 0;
    if (checklist.calibrationCertificates) {
      factoryScore += 15;
    } else {
      blockers.push({
        category: 'FACTORY_QC',
        severity: 'BLOCKER',
        blocker_description: 'Calibration certificates for critical in-house test equipment have expired or are missing.',
        required_action: 'Perform recalibration by NABL accredited calibration facility and attach valid certificates.'
      });
    }
    if (checklist.qcPersonnelQualified || checklist.competentStaff) {
      factoryScore += 10;
    } else {
      blockers.push({
        category: 'FACTORY_QC',
        severity: 'WARNING',
        blocker_description: 'Designation of qualified QC chemist/metallurgist/engineer is missing.',
        required_action: 'Submit resume and qualification degree certificate of dedicated technical in-charge.'
      });
    }

    // Evaluate documentation (25 points)
    let docScore = 0;
    if (checklist.plantLayout) docScore += 8;
    else blockers.push({ category: 'DOCUMENTATION', severity: 'WARNING', blocker_description: 'Factory manufacturing layout diagram missing.', required_action: 'Provide plant schematic indicating storage and quarantine areas.' });

    if (checklist.processFlowchart) docScore += 8;
    else blockers.push({ category: 'DOCUMENTATION', severity: 'WARNING', blocker_description: 'Manufacturing process flowchart missing.', required_action: 'Upload step-by-step flow diagram showing quality inspection nodes.' });

    if (checklist.machineryList) docScore += 9;
    else blockers.push({ category: 'DOCUMENTATION', severity: 'BLOCKER', blocker_description: 'Installed manufacturing machinery & capacity list not provided.', required_action: 'Provide machinery inventory on company letterhead.' });

    // Evaluate statutory (15 points)
    let statutoryScore = 0;
    if (checklist.panGstUdyam || checklist.businessRegistration) statutoryScore += 8;
    else blockers.push({ category: 'STATUTORY', severity: 'BLOCKER', blocker_description: 'Valid Udyam / Factory License / GST certificate missing.', required_action: 'Upload statutory business incorporation and premises documents.' });

    if (checklist.brandAuthorization || checklist.trademarkCertificate) statutoryScore += 7;
    else blockers.push({ category: 'STATUTORY', severity: 'WARNING', blocker_description: 'Trademark / Brand authorization letter not provided.', required_action: 'Submit Trademark application TM-A or owner authorization letter.' });

    const totalScore = Number((testingScore + factoryScore + docScore + statutoryScore).toFixed(2));
    const status = totalScore >= 80 ? 'READY_TO_APPLY' : (totalScore >= 60 ? 'NEAR_READY' : 'NOT_READY');

    // Persist into readiness_scores
    const scoreId = 'score_' + Date.now();
    await db.insert('readiness_scores', {
      id: scoreId,
      applicant_id: applicantId,
      standard_number: standardNumber,
      overall_score: totalScore,
      status,
      calculated_at: new Date().toISOString()
    });

    // Record blockers into readiness_blockers
    for (const b of blockers) {
      await db.insert('readiness_blockers', {
        id: 'block_' + Math.random().toString(36).substring(2, 9),
        score_id: scoreId,
        category: b.category,
        blocker_description: b.blocker_description,
        severity: b.severity,
        required_action: b.required_action
      });
    }

    // Record history
    const historyList = await db.query(h => h.applicant_id === applicantId, 'readiness_history');
    const prevScore = historyList.length > 0 ? historyList[historyList.length - 1].new_score : 0;
    await db.insert('readiness_history', {
      id: 'rhist_' + Date.now(),
      applicant_id: applicantId,
      previous_score: prevScore,
      new_score: totalScore,
      delta: Number((totalScore - prevScore).toFixed(2)),
      updated_at: new Date().toISOString()
    });

    return {
      score_id: scoreId,
      applicant_id: applicantId,
      standard_number: standardNumber,
      readiness_score: totalScore,
      readiness_percentage: `${totalScore}%`,
      status,
      readiness_verdict: totalScore >= 80
        ? 'Application package is robust and ready for formal submission on the Manakonline portal.'
        : `Readiness is at ${totalScore}%. Clear the ${blockers.filter(b => b.severity === 'BLOCKER').length} critical blocker(s) before applying to prevent rejection.`,
      category_scores: {
        testing: { score: testingScore, max: dimensionWeights.testing },
        factory_qc: { score: factoryScore, max: dimensionWeights.factoryQc },
        documentation: { score: docScore, max: dimensionWeights.documentation },
        statutory: { score: statutoryScore, max: dimensionWeights.statutory }
      },
      blockers_count: blockers.length,
      critical_blockers: blockers.filter(b => b.severity === 'BLOCKER'),
      warnings: blockers.filter(b => b.severity === 'WARNING'),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { ApplicationReadinessCalculator };