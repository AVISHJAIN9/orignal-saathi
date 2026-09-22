/**
 * S18 — Lab / Sample Testing Status Tracker
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Tracks testing lifecycle with enforced FSM transitions.
 * Stage transitions: sample_received → in_testing → passed | failed
 * Skip-ahead transitions are rejected (e.g., sample_received → passed is invalid).
 *
 * Tables: testing_status (s/database.js)
 */

const { sDb } = require('../database');

// FSM: allowed next stages from each stage
const STAGE_TRANSITIONS = {
  sample_received: ['in_testing'],
  in_testing: ['passed', 'failed'],
  passed: [], // terminal
  failed: []  // terminal
};

const ALL_STAGES = Object.keys(STAGE_TRANSITIONS);

class LabSampleTrackerService {
  /**
   * Create a new testing record when a sample is received.
   */
  async createTestingRecord({ application_id, sample_id, lab_name }) {
    if (!application_id || !sample_id || !lab_name) {
      throw new Error('application_id, sample_id, and lab_name are required');
    }

    const record = {
      id: 'test_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      application_id,
      sample_id,
      stage: 'sample_received',
      lab_name,
      test_report_url: null,
      updated_at: new Date().toISOString()
    };

    await sDb.insert('testing_status', record);
    return { success: true, testing_record: record };
  }

  /**
   * Get testing status for an application.
   */
  async getStatus(applicationId) {
    if (!applicationId) throw new Error('applicationId is required');

    const all = await sDb.getTable('testing_status');
    const records = all.filter(t => t.application_id === applicationId);

    if (records.length === 0) {
      return {
        application_id: applicationId,
        status: 'NO_SAMPLE_SUBMITTED',
        records: []
      };
    }

    return {
      application_id: applicationId,
      total_samples: records.length,
      passed: records.filter(r => r.stage === 'passed').length,
      failed: records.filter(r => r.stage === 'failed').length,
      in_progress: records.filter(r => !['passed', 'failed'].includes(r.stage)).length,
      records
    };
  }

  /**
   * Advance the testing stage for a record. Enforces FSM — rejects skip-ahead.
   */
  async advanceStage(recordId, newStage, test_report_url) {
    if (!recordId || !newStage) throw new Error('recordId and newStage are required');
    if (!ALL_STAGES.includes(newStage)) {
      throw new Error(`Invalid stage '${newStage}'. Valid stages: ${ALL_STAGES.join(', ')}`);
    }

    const record = await sDb.findOne('testing_status', t => t.id === recordId);
    if (!record) throw new Error(`Testing record ${recordId} not found`);

    const allowedNext = STAGE_TRANSITIONS[record.stage] || [];
    if (allowedNext.length === 0) {
      throw new Error(
        `Stage '${record.stage}' is a terminal state. No further transitions allowed.`
      );
    }
    if (!allowedNext.includes(newStage)) {
      throw new Error(
        `Invalid transition: ${record.stage} → ${newStage}. ` +
        `Allowed transitions from '${record.stage}': ${allowedNext.join(', ')}`
      );
    }

    const patch = {
      stage: newStage,
      updated_at: new Date().toISOString(),
      ...(test_report_url ? { test_report_url } : {})
    };

    return sDb.update('testing_status', t => t.id === recordId, patch);
  }

  /**
   * Get a single testing record by ID.
   */
  async getRecord(recordId) {
    if (!recordId) throw new Error('recordId is required');
    const record = await sDb.findOne('testing_status', t => t.id === recordId);
    if (!record) throw new Error(`Testing record ${recordId} not found`);
    return record;
  }

  /**
   * Get all records for a lab (officer view).
   */
  async getRecordsByLab(labName) {
    if (!labName) throw new Error('labName is required');
    const all = await sDb.getTable('testing_status');
    return all.filter(t => t.lab_name === labName);
  }
}

module.exports = { LabSampleTrackerService };
