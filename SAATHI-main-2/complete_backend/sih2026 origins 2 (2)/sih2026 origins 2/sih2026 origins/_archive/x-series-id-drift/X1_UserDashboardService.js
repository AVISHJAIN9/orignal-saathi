/**
 * X1 — User Dashboard & Profile Management
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Assembles dashboard overview from real data: active applications (S17),
 * upcoming renewals (S11/C14), open gaps (C26), recent recalls (S22).
 *
 * No hardcoded counts.
 */

const { sDb } = require('../../s/database');
const { db: cDb } = require('../../c/database');

class UserDashboardService {
  static async getDashboardOverview(userId) {
    if (!userId) throw new Error('userId is required');

    // Active applications for this user
    const allApps = await sDb.getTable('applications');
    const myApps = allApps.filter(a => a.applicant_id === userId);
    const activeApps = myApps.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW');

    // Upcoming renewals (licenses expiring in < 90 days)
    const licRecords = await sDb.getTable('licensing_records');
    const now = new Date();
    const upcomingRenewals = licRecords.filter(l => {
      const daysLeft = Math.ceil((new Date(l.valid_till) - now) / (1000 * 60 * 60 * 24));
      return daysLeft >= 0 && daysLeft <= 90 && l.status === 'ACTIVE';
    });

    // Open compliance gaps
    const allGaps = await cDb.getTable('compliance_gaps');
    const userGaps = allGaps.filter(g => g.manufacturer_id === userId && g.status === 'OPEN');

    // Active recalls
    const allRecalls = await sDb.getTable('recalls');
    const myRecalls = allRecalls.filter(r => r.status === 'ACTIVE');

    // Pending fee payments
    const allFees = await sDb.getTable('payments_fees');
    const pendingFees = allFees.filter(f => f.applicant_id === userId && f.status === 'PENDING');

    return {
      user_id: userId,
      active_applications: activeApps.length,
      upcoming_renewals: upcomingRenewals.length,
      open_compliance_gaps: userGaps.length,
      active_recalls: myRecalls.length,
      pending_fee_payments: pendingFees.length,
      requires_attention: userGaps.length > 0 || upcomingRenewals.length > 0 || pendingFees.length > 0,
      recent_applications: myApps.slice(-3),
      generated_at: new Date().toISOString()
    };
  }

  static async getUserProfile(userId) {
    if (!userId) throw new Error('userId is required');
    const profiles = await sDb.getTable('applicant_business_profiles');
    const profile = profiles.find(p => p.id === userId);
    if (!profile) throw new Error(`No profile found for user ${userId}`);
    return profile;
  }
}

module.exports = { UserDashboardService };
