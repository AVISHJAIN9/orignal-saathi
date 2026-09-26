/**
 * P2: Role-Based Access Control (RBAC) & Policy Engine (MERN Stack)
 */
class RBACPolicyEngine {
  static checkPermission(role = 'CITIZEN', action = 'READ', resource = 'STANDARDS') {
    const rolePermissions = {
      ADMIN: ['*'],
      OFFICER: ['READ', 'WRITE', 'AUDIT', 'APPROVE', 'REJECT'],
      MANUFACTURER: ['READ', 'SUBMIT', 'UPDATE_PROFILE', 'PAY'],
      LAB_ANALYST: ['READ', 'UPLOAD_TEST_REPORT'],
      CITIZEN: ['READ']
    };

    const allowed = (rolePermissions[role] && rolePermissions[role].includes('*')) ||
      (rolePermissions[role] && rolePermissions[role].includes(action));

    return {
      role,
      action,
      resource,
      granted: !!allowed,
      evaluatedAt: new Date().toISOString()
    };
  }
}

const checkPermission = (role, action, resource) =>
  RBACPolicyEngine.checkPermission(role, action, resource);

module.exports = {
  RBACPolicyEngine,
  checkPermission
};
