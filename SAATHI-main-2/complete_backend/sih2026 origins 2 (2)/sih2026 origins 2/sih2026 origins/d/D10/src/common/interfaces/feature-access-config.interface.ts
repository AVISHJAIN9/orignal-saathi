import { Role } from '../enums/role.enum';

export type FeatureAccessMap = Record<Role, string[]>;

export interface FeatureAccessConfig {
  /** Which SAATHI feature IDs each role can see/use right now. */
  map: FeatureAccessMap;
  /**
   * Features listed here are hard-disabled for everyone regardless of
   * role - the kill switch for a phased rollout or a feature pulled
   * mid-demo (X6/X7/X9 are the likely candidates pre-launch).
   */
  globallyDisabled: string[];
}
