/**
 * Mirrors P1's role model (Authentication & Rate Limiting).
 * Kept local so this module compiles standalone; when merging into the real
 * monorepo, delete this file and import P1's canonical Role enum instead —
 * just make sure the string values line up ('public' | 'admin').
 */
export enum Role {
  PUBLIC = 'public',
  ADMIN = 'admin',
}
