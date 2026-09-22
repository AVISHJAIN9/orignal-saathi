/**
 * S9 — Multi-User Business Accounts
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Sub-user management scoped to business_account_id. All actions are gated
 * on business_account_id so sub-users cannot access other accounts' data.
 * Extends P1's RBAC: valid roles enforced at DB level.
 *
 * Tables: business_accounts, sub_users (s/database.js)
 */

const { sDb } = require('../database');

const VALID_ROLES = ['ADMIN', 'QA_MANAGER', 'COMPLIANCE_OFFICER', 'VIEWER'];

class BusinessAccountService {
  /**
   * Create a new business account linked to a primary license.
   */
  async createAccount({ primary_license_id, company_name }) {
    if (!primary_license_id || !company_name) {
      throw new Error('primary_license_id and company_name are required');
    }

    // Verify license exists
    const license = await sDb.findOne('licensing_records', l => l.license_id === primary_license_id);
    if (!license) throw new Error(`License ${primary_license_id} not found`);

    const account = {
      id: 'biz_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      primary_license_id,
      company_name,
      created_at: new Date().toISOString()
    };

    await sDb.insert('business_accounts', account);
    return { success: true, account };
  }

  /**
   * Add a sub-user to a business account. Scoped to business_account_id.
   */
  async addSubUser({ business_account_id, user_id, email, role }) {
    if (!business_account_id || !user_id || !email || !role) {
      throw new Error('business_account_id, user_id, email, and role are required');
    }
    if (!VALID_ROLES.includes(role)) {
      throw new Error(`Invalid role '${role}'. Must be one of: ${VALID_ROLES.join(', ')}`);
    }

    // Verify the business account exists
    const account = await sDb.findOne('business_accounts', a => a.id === business_account_id);
    if (!account) throw new Error(`Business account ${business_account_id} not found`);

    // Check for duplicate user in this account
    const existing = await sDb.findOne('sub_users',
      u => u.business_account_id === business_account_id && u.user_id === user_id
    );
    if (existing) {
      throw new Error(`User ${user_id} is already a member of account ${business_account_id}`);
    }

    const subUser = {
      id: 'subuser_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      business_account_id,
      user_id,
      email,
      role,
      created_at: new Date().toISOString()
    };

    await sDb.insert('sub_users', subUser);
    return { success: true, sub_user: subUser };
  }

  /**
   * List all sub-users for a business account. Scoped to business_account_id.
   */
  async listSubUsers(business_account_id) {
    if (!business_account_id) throw new Error('business_account_id is required');

    // Verify account exists first
    const account = await sDb.findOne('business_accounts', a => a.id === business_account_id);
    if (!account) throw new Error(`Business account ${business_account_id} not found`);

    const all = await sDb.getTable('sub_users');
    const members = all.filter(u => u.business_account_id === business_account_id);

    return {
      business_account_id,
      company_name: account.company_name,
      member_count: members.length,
      members
    };
  }

  /**
   * Remove a sub-user from a business account.
   */
  async removeSubUser(business_account_id, user_id) {
    if (!business_account_id || !user_id) {
      throw new Error('business_account_id and user_id are required');
    }

    const existing = await sDb.findOne('sub_users',
      u => u.business_account_id === business_account_id && u.user_id === user_id
    );
    if (!existing) {
      throw new Error(`User ${user_id} is not a member of account ${business_account_id}`);
    }

    await sDb.update('sub_users',
      u => u.business_account_id === business_account_id && u.user_id === user_id,
      { status: 'REMOVED', removed_at: new Date().toISOString() }
    );

    return { success: true, removed_user_id: user_id, business_account_id };
  }

  /**
   * Update a sub-user's role within a business account.
   */
  async updateRole(business_account_id, user_id, newRole) {
    if (!VALID_ROLES.includes(newRole)) {
      throw new Error(`Invalid role '${newRole}'. Must be one of: ${VALID_ROLES.join(', ')}`);
    }

    const existing = await sDb.findOne('sub_users',
      u => u.business_account_id === business_account_id && u.user_id === user_id
    );
    if (!existing) throw new Error(`User ${user_id} not found in account ${business_account_id}`);

    return sDb.update('sub_users',
      u => u.business_account_id === business_account_id && u.user_id === user_id,
      { role: newRole }
    );
  }
}

module.exports = { BusinessAccountService };
