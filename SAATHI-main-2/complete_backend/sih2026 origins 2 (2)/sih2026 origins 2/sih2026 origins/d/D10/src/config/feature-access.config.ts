import { Role } from '../common/enums/role.enum';
import { FeatureAccessConfig } from '../common/interfaces/feature-access-config.interface';

/**
 * Central role -> feature map backing D10's "per-role feature access
 * scoping". This is the single file to edit when a feature moves from
 * Gate 4 (differentiators) to general availability, or when X1-X12
 * roll out in phases per the build-order Gates in the spec.
 *
 * ADMIN implicitly inherits everything - listed explicitly anyway so
 * this file stays the one source of truth (no hidden "admin sees all"
 * branch buried elsewhere in the codebase).
 */
export const featureAccessConfig: FeatureAccessConfig = {
  map: {
    [Role.PUBLIC]: [
      'D1', 'D2', 'D3', 'D8', 'D9',
      'G1', 'G2', 'G3', 'G7', 'G8', 'G15',
      'X2', 'X3', 'X5', 'X11',
    ],
    [Role.INDUSTRY]: [
      'D1', 'D2', 'D3', 'D4', 'D7', 'D8', 'D9',
      'G1', 'G2', 'G3', 'G7', 'G8', 'G15',
      'X1', 'X2', 'X3', 'X5', 'X8', 'X10', 'X11', 'X12',
    ],
    [Role.ADMIN]: [
      'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10',
      'G1', 'G2', 'G3', 'G7', 'G8', 'G15',
      'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'X8', 'X9', 'X10', 'X11', 'X12',
      'P1', 'P2', 'P3', 'P4',
    ],
  },
  globallyDisabled: [
    // e.g. 'X6' while WhatsApp Cloud API verification (Meta Business
    // Manager) is still pending, per the risk register.
  ],
};
