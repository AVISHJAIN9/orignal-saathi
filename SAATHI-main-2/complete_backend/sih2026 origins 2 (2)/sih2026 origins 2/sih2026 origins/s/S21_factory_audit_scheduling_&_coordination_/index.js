/**
 * S21 — Factory Audit Scheduling & Coordination Portal
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Extends S6 visit scheduling with audit report submission and retrieval.
 * audit_report_status on visit_appointments: PENDING → SUBMITTED → APPROVED
 *
 * Tables: visit_appointments, audit_reports (s/database.js)
 */

const { sDb } = require('../database');

class FactoryAuditCoordinatorService {
  /**
   * Submit an audit report for a completed visit.
   */
  async submitAuditReport({ visit_id, file_ref, submitted_by, score, conformance_status }) {
    if (!visit_id || !file_ref || !submitted_by) {
      throw new Error('visit_id, file_ref, and submitted_by are required');
    }
    const validStatuses = ['CONFORMING', 'NON_CONFORMING', 'CONDITIONAL'];
    if (conformance_status && !validStatuses.includes(conformance_status)) {
      throw new Error(`conformance_status must be one of: ${validStatuses.join(', ')}`);
    }

    const visit = await sDb.findOne('visit_appointments', v => v.id === visit_id);
    if (!visit) throw new Error(`Visit ${visit_id} not found`);
    if (visit.audit_report_status === 'SUBMITTED') {
      throw new Error(`Audit report already submitted for visit ${visit_id}`);
    }

    const report = {
      id: 'audit_rpt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      visit_id,
      file_ref,
      score: score !== undefined ? Number(score) : null,
      conformance_status: conformance_status || 'CONFORMING',
      submitted_by,
      submitted_at: new Date().toISOString()
    };

    await sDb.insert('audit_reports', report);
    await sDb.update('visit_appointments', v => v.id === visit_id, {
      audit_report_status: 'SUBMITTED',
      status: 'COMPLETED'
    });

    return { success: true, audit_report: report };
  }

  /**
   * Get audit report for a visit.
   */
  async getAuditReport(visitId) {
    if (!visitId) throw new Error('visitId is required');

    const visit = await sDb.findOne('visit_appointments', v => v.id === visitId);
    if (!visit) throw new Error(`Visit ${visitId} not found`);

    const all = await sDb.getTable('audit_reports');
    const report = all.find(r => r.visit_id === visitId);

    return {
      visit,
      audit_report: report || null,
      has_report: Boolean(report)
    };
  }

  /**
   * Approve an audit report (senior officer action).
   */
  async approveReport(visitId, approver_id) {
    const visit = await sDb.findOne('visit_appointments', v => v.id === visitId);
    if (!visit) throw new Error(`Visit ${visitId} not found`);
    if (visit.audit_report_status !== 'SUBMITTED') {
      throw new Error(`Cannot approve: audit_report_status is '${visit.audit_report_status}', expected 'SUBMITTED'`);
    }

    await sDb.update('visit_appointments', v => v.id === visitId, {
      audit_report_status: 'APPROVED',
      approved_by: approver_id,
      approved_at: new Date().toISOString()
    });

    return { success: true, visit_id: visitId, approved_by: approver_id };
  }

  /**
   * Get all visits with their audit status (for coordination dashboard).
   */
  async getAuditDashboard({ status, officer_id } = {}) {
    let visits = await sDb.getTable('visit_appointments');
    if (status) visits = visits.filter(v => v.audit_report_status === status);
    if (officer_id) visits = visits.filter(v => v.officer_id === officer_id);

    const reports = await sDb.getTable('audit_reports');
    const reportMap = {};
    for (const r of reports) reportMap[r.visit_id] = r;

    return visits.map(v => ({
      ...v,
      audit_report: reportMap[v.id] || null
    }));
  }
}

module.exports = { FactoryAuditCoordinatorService };
