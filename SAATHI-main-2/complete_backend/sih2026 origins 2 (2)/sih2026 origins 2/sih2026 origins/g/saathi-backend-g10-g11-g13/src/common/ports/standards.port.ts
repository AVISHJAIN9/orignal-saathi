/**
 * G13 reads D2's standards metadata to list crawlable URLs — no new table
 * per spec. Same reasoning as the other ports in this delivery: depending
 * on D2's real repository directly would block this module from compiling
 * until D2's code exists. D2's owner implements this against the real
 * standards table and swaps the provider in sitemap.module.ts.
 */
export interface PublicStandardEntry {
  slug: string;
  updatedAt: Date;
}

export interface StandardsPort {
  listPublicSlugs(): Promise<PublicStandardEntry[]>;
}

export const STANDARDS_PORT = Symbol('STANDARDS_PORT');
