/**
 * S26 — Multi-Factory / Multi-Location License Management
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Manages multiple factory locations under a single business account.
 * Each location can have its own license_id. Exactly one location per account is primary.
 *
 * Tables: factory_locations, business_accounts (s/database.js)
 */

const { sDb } = require('../database');

class MultiFactoryManagerService {
  /**
   * Add a factory location to a business account.
   */
  async addLocation({ business_account_id, location_name, address, state, pincode, license_id, is_primary }) {
    if (!business_account_id || !address || !state || !pincode) {
      throw new Error('business_account_id, address, state, and pincode are required');
    }

    const account = await sDb.findOne('business_accounts', a => a.id === business_account_id);
    if (!account) throw new Error(`Business account ${business_account_id} not found`);

    // If setting as primary, un-primary any existing primary
    if (is_primary) {
      const all = await sDb.getTable('factory_locations');
      const existingPrimary = all.find(
        l => l.business_account_id === business_account_id && l.is_primary
      );
      if (existingPrimary) {
        await sDb.update('factory_locations', l => l.id === existingPrimary.id, { is_primary: false });
      }
    }

    const location = {
      id: 'floc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      business_account_id,
      location_name: location_name || `Factory ${state}`,
      address,
      state,
      pincode: String(pincode),
      license_id: license_id || null,
      is_primary: Boolean(is_primary),
      created_at: new Date().toISOString()
    };

    await sDb.insert('factory_locations', location);
    return { success: true, location };
  }

  /**
   * Get all factory locations for a business account.
   */
  async getLocations(business_account_id) {
    if (!business_account_id) throw new Error('business_account_id is required');

    const account = await sDb.findOne('business_accounts', a => a.id === business_account_id);
    if (!account) throw new Error(`Business account ${business_account_id} not found`);

    const all = await sDb.getTable('factory_locations');
    const locations = all.filter(l => l.business_account_id === business_account_id);

    return {
      business_account_id,
      company_name: account.company_name,
      total_locations: locations.length,
      primary_location: locations.find(l => l.is_primary) || null,
      locations
    };
  }

  /**
   * Update a factory location's details.
   */
  async updateLocation(locationId, updates) {
    const location = await sDb.findOne('factory_locations', l => l.id === locationId);
    if (!location) throw new Error(`Factory location ${locationId} not found`);

    // Don't allow changing business_account_id
    if (updates.business_account_id && updates.business_account_id !== location.business_account_id) {
      throw new Error('Cannot change business_account_id of a factory location');
    }

    // Handle primary flag change
    if (updates.is_primary && !location.is_primary) {
      const all = await sDb.getTable('factory_locations');
      const existingPrimary = all.find(
        l => l.business_account_id === location.business_account_id && l.is_primary && l.id !== locationId
      );
      if (existingPrimary) {
        await sDb.update('factory_locations', l => l.id === existingPrimary.id, { is_primary: false });
      }
    }

    const allowed = ['location_name', 'address', 'state', 'pincode', 'license_id', 'is_primary'];
    const patch = {};
    for (const key of allowed) {
      if (key in updates) patch[key] = updates[key];
    }

    return sDb.update('factory_locations', l => l.id === locationId, patch);
  }

  /**
   * Remove a factory location.
   */
  async removeLocation(locationId) {
    const location = await sDb.findOne('factory_locations', l => l.id === locationId);
    if (!location) throw new Error(`Factory location ${locationId} not found`);
    if (location.is_primary) throw new Error('Cannot remove the primary factory location. Set another location as primary first.');

    return sDb.update('factory_locations', l => l.id === locationId, {
      status: 'REMOVED',
      removed_at: new Date().toISOString()
    });
  }
}

module.exports = { MultiFactoryManagerService };
