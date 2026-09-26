import { SetMetadata } from '@nestjs/common';
import { FEATURE_KEY } from '../constants';

/**
 * Gates a route behind a named SAATHI feature ID (e.g. 'X6', 'D9').
 * Checked by FeatureAccessGuard against the role -> feature map in
 * config/feature-access.config.ts, so a feature can be turned on for
 * INDUSTRY/ADMIN ahead of a phased PUBLIC rollout, or killed globally,
 * without touching guard logic in every downstream feature module.
 */
export const RequireFeature = (featureId: string) =>
  SetMetadata(FEATURE_KEY, featureId);
