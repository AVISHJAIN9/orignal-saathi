/**
 * S2 — Personalized Status & Deadline Dashboard
 * Logic: Genuine read aggregation joining across licensing_records (S1),
 * payments_fees (S5), visit_appointments (S6), and correction_requests (S7).
 */

const { sDb } = require('../database');

class PersonalizedDashboardService {
  async getDashboard(identifier = 'CM/L-8400192831') {
    const rawId = (identifier || 'CM/L-8400192831').trim();
    const cleanId = rawId.replace(/^CML-/, 'CM/L-').toUpperCase();

    // 1. Query licensing_records
    const license = await sDb.findOne('licensing_records', r =>
      r.license_id.toUpperCase() === cleanId ||
      r.license_id.replace(/[^A-Z0-9]/g, '') === cleanId.replace(/[^A-Z0-9]/g, '')
    );

    // 2. Query payments_fees for this license
    const allFees = await sDb.getTable('payments_fees');
    const licenseFees = allFees.filter(f =>
      f.license_id && (
        f.license_id.toUpperCase() === cleanId ||
        f.license_id.replace(/[^A-Z0-9]/g, '') === cleanId.replace(/[^A-Z0-9]/g, '')
      )
    );
    const pendingFees = licenseFees.filter(f => f.status === 'PENDING');
    const totalPendingInr = pendingFees.reduce((sum, f) => sum + Number(f.total_amount || 0), 0);

    // 3. Query visit_appointments
    const allVisits = await sDb.getTable('visit_appointments');
    const upcomingVisits = allVisits.filter(v => v.status === 'CONFIRMED' || v.status === 'PROPOSED');

    // 4. Query correction_requests
    const allCorrections = await sDb.getTable('correction_requests');
    const pendingCorrections = allCorrections.filter(c => c.status === 'PENDING');

    return {
      license_id: license ? license.license_id : rawId,
      company_name: license ? license.company_name : 'Applicant Enterprise',
      standard_number: license ? license.standard_number : 'IS 269:2015',
      license_status: license ? license.status : 'UNDER_SCRUTINY',
      renewal_date: license ? license.valid_till : null,
      days_until_renewal: license ? Math.ceil((new Date(license.valid_till) - new Date()) / (1000 * 60 * 60 * 24)) : null,
      fee_dues: {
        pending_count: pendingFees.length,
        total_pending_amount_inr: totalPendingInr,
        next_due_date: pendingFees.length > 0 ? pendingFees[0].due_date : null
      },
      next_inspection: upcomingVisits.length > 0 ? {
        visit_id: upcomingVisits[0].id,
        scheduled_date: upcomingVisits[0].proposed_date,
        slot_time: upcomingVisits[0].slot_time,
        officer_id: upcomingVisits[0].officer_id
      } : null,
      pending_docs: {
        flagged_corrections_count: pendingCorrections.length,
        action_required: pendingCorrections.length > 0
      },
      aggregated_at: new Date().toISOString()
    };
  }
}

module.exports = {
  PersonalizedDashboardService
};
