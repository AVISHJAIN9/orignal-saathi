/**
 * X7 — Team Collaboration & Workspace Access Service
 * Status: IMPLEMENTED_AND_VERIFIED
 *
 * Manages organization team members, role assignments, and member invitations.
 * Stores state in team_members and team_invitations tables.
 *
 * Tables: team_members, team_invitations (c/database.js)
 */

const crypto = require('crypto');
const { db } = require('../../c/database');

const VALID_ROLES = ['COMPLIANCE_HEAD', 'QUALITY_ENGINEER', 'LEGAL_COUNSEL', 'INTERNAL_AUDITOR', 'OPERATOR', 'VIEWER'];

class TeamCollaborationService {
  static async getTeamMembers(organizationId = 'org_default') {
    if (!organizationId) throw new Error('organizationId is required');

    const allMembers = await db.getTable('team_members');
    const members = allMembers.filter(m => m.organization_id === organizationId && !m.removed_at);

    return {
      organizationId,
      totalCount: members.length,
      members: members.map(m => ({
        memberId: m.id,
        userId: m.user_id,
        name: m.name,
        email: m.email,
        role: m.role,
        joinedAt: m.joined_at,
        status: m.status || 'ACTIVE'
      }))
    };
  }

  static async inviteMember(organizationId, email, role, invitedBy = 'usr_admin') {
    if (!organizationId || !email || !role) {
      throw new Error('organizationId, email, and role are required');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim().toUpperCase();

    if (!VALID_ROLES.includes(cleanRole)) {
      throw new Error(`Invalid role '${cleanRole}'. Must be one of: ${VALID_ROLES.join(', ')}`);
    }

    // Check if active member already exists
    const existingMember = await db.findOne('team_members', 
      m => m.organization_id === organizationId && m.email === cleanEmail && !m.removed_at
    );
    if (existingMember) {
      throw new Error(`User with email '${cleanEmail}' is already an active member of this organization`);
    }

    const invitationToken = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString(); // 7 days

    const invitation = {
      id: 'inv_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex'),
      organization_id: organizationId,
      email: cleanEmail,
      role: cleanRole,
      invited_by: invitedBy,
      token: invitationToken,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      expires_at: expiresAt
    };

    await db.insert('team_invitations', invitation);

    return {
      success: true,
      invitationId: invitation.id,
      organizationId,
      email: cleanEmail,
      role: cleanRole,
      status: 'SENT',
      expiresAt
    };
  }

  static async acceptInvitation(token, userId, userName) {
    if (!token || !userId) throw new Error('token and userId are required');

    const inv = await db.findOne('team_invitations', i => i.token === token && i.status === 'PENDING');
    if (!inv) throw new Error('Invalid or already used invitation token');

    if (new Date(inv.expires_at) < new Date()) {
      await db.update('team_invitations', i => i.id === inv.id, { status: 'EXPIRED' });
      throw new Error('Invitation has expired');
    }

    const newMember = {
      id: 'mem_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex'),
      organization_id: inv.organization_id,
      user_id: userId,
      name: userName || inv.email.split('@')[0],
      email: inv.email,
      role: inv.role,
      status: 'ACTIVE',
      joined_at: new Date().toISOString(),
      removed_at: null
    };

    await db.insert('team_members', newMember);
    await db.update('team_invitations', i => i.id === inv.id, { status: 'ACCEPTED', accepted_at: new Date().toISOString() });

    return { success: true, member: newMember };
  }

  static async removeMember(organizationId, memberId, requestedBy) {
    const member = await db.findOne('team_members', m => m.id === memberId && m.organization_id === organizationId);
    if (!member) throw new Error(`Member ${memberId} not found in organization`);

    await db.update('team_members', m => m.id === memberId, { 
      removed_at: new Date().toISOString(),
      removed_by: requestedBy 
    });

    return { success: true, memberId, status: 'REMOVED' };
  }
}

const getTeamMembers = (orgId) => TeamCollaborationService.getTeamMembers(orgId);
const inviteMember = (orgId, email, role) => TeamCollaborationService.inviteMember(orgId, email, role);

module.exports = { TeamCollaborationService, getTeamMembers, inviteMember };
