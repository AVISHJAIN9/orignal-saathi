/**
 * S20 — In-App Calendar / Reminder Sync
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Generates a valid RFC 5545 ICS calendar file from real S2 dashboard data
 * (license renewal, fee due dates) and S6 visit appointment data.
 * Test: parse output with regex for BEGIN:VCALENDAR, DTSTART, SUMMARY fields.
 *
 * No new table — reads S2 + S6 data from existing tables.
 */

const { sDb } = require('../database');

class CalendarSyncService {
  /**
   * Generate a valid ICS calendar file for a license holder.
   * Returns the ICS string (serve with Content-Type: text/calendar).
   */
  async generateICS(licenseId) {
    if (!licenseId) throw new Error('licenseId is required');

    const cleanId = String(licenseId).replace(/^CML-/, 'CM/L-').toUpperCase();

    // Gather events from multiple tables
    const events = [];

    // 1. License renewal date from licensing_records
    const license = await sDb.findOne('licensing_records', l =>
      l.license_id.toUpperCase() === cleanId ||
      l.license_id.replace(/[^A-Z0-9]/g, '') === cleanId.replace(/[^A-Z0-9]/g, '')
    );
    if (license) {
      events.push({
        uid: `renewal-${license.license_id}@saathi.bis.gov.in`,
        summary: `BIS License Renewal Due — ${license.company_name}`,
        description: `License ${license.license_id} for ${license.product_name} (${license.standard_number}) expires on this date. Initiate renewal 90 days prior.`,
        dtstart: this._formatICSDate(license.valid_till),
        dtend: this._formatICSDate(license.valid_till, 1),
        categories: 'RENEWAL'
      });
    }

    // 2. Pending fee due dates from payments_fees
    const allFees = await sDb.getTable('payments_fees');
    const pendingFees = allFees.filter(f =>
      f.license_id && f.license_id.replace(/[^A-Z0-9]/g, '') === cleanId.replace(/[^A-Z0-9]/g, '') &&
      f.status === 'PENDING' &&
      f.due_date
    );
    for (const fee of pendingFees) {
      events.push({
        uid: `fee-${fee.id}@saathi.bis.gov.in`,
        summary: `BIS Fee Due — ${fee.fee_type} (INR ${fee.total_amount})`,
        description: `Fee type: ${fee.fee_type}. Amount: INR ${fee.total_amount}. Pay via the SAATHI portal.`,
        dtstart: this._formatICSDate(fee.due_date),
        dtend: this._formatICSDate(fee.due_date, 1),
        categories: 'FEE'
      });
    }

    // 3. Upcoming visits from visit_appointments
    const allVisits = await sDb.getTable('visit_appointments');
    const myVisits = allVisits.filter(v =>
      (v.applicant_id === licenseId || v.applicant_id === cleanId) &&
      ['PROPOSED', 'CONFIRMED'].includes(v.status)
    );
    for (const visit of myVisits) {
      events.push({
        uid: `visit-${visit.id}@saathi.bis.gov.in`,
        summary: `BIS ${visit.status === 'CONFIRMED' ? 'Confirmed' : 'Proposed'} Inspector Visit`,
        description: `Officer ID: ${visit.officer_id}. Slot: ${visit.slot_time}. Status: ${visit.status}.${visit.notes ? ' Notes: ' + visit.notes : ''}`,
        dtstart: this._formatICSDate(visit.proposed_date),
        dtend: this._formatICSDate(visit.proposed_date, 1),
        categories: 'AUDIT'
      });
    }

    if (events.length === 0) {
      // Still produce valid ICS with no events rather than an error
      events.push({
        uid: `no-events-${Date.now()}@saathi.bis.gov.in`,
        summary: 'SAATHI BIS Calendar — No Upcoming Events',
        description: `No upcoming compliance events found for ${licenseId}. Check back after submitting an application.`,
        dtstart: this._formatICSDate(new Date().toISOString()),
        dtend: this._formatICSDate(new Date().toISOString(), 1),
        categories: 'INFO'
      });
    }

    const ics = this._buildICS(events, licenseId);
    return { ics_content: ics, event_count: events.length, license_id: licenseId };
  }

  /**
   * Build a valid RFC 5545 ICS string.
   */
  _buildICS(events, calName) {
    const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z/, 'Z');
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SAATHI BIS Portal//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:SAATHI BIS Compliance — ${calName}`,
      'X-WR-TIMEZONE:Asia/Kolkata'
    ];

    for (const evt of events) {
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${evt.uid}`);
      lines.push(`DTSTAMP:${now}`);
      lines.push(`DTSTART;VALUE=DATE:${evt.dtstart}`);
      lines.push(`DTEND;VALUE=DATE:${evt.dtend}`);
      lines.push(`SUMMARY:${this._escapeICS(evt.summary)}`);
      lines.push(`DESCRIPTION:${this._escapeICS(evt.description)}`);
      lines.push(`CATEGORIES:${evt.categories}`);
      lines.push('END:VEVENT');
    }

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  /**
   * Format a date string as ICS DATE: YYYYMMDD
   */
  _formatICSDate(dateStr, offsetDays = 0) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10).replace(/-/g, '');
  }

  _escapeICS(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }
}

module.exports = { CalendarSyncService };
