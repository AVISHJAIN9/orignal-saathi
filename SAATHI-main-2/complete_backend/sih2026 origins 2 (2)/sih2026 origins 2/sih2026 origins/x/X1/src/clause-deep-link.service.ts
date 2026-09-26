import { Injectable } from '@nestjs/common';
import { extractAllCitations, parseClauseReference, ParsedClauseReference } from './clause-parser';
import { buildDeepLink, DeepLinkParams, parseDeepLinkUrl, ResolvedDeepLink } from './deep-link.builder';
import { ClauseCitationRecord, ReverseClauseIndex } from './reverse-clause-index';

@Injectable()
export class ClauseDeepLinkService {
  private readonly reverseIndex = new ReverseClauseIndex();

  public parseReference(rawCitation: string): ParsedClauseReference {
    return parseClauseReference(rawCitation);
  }

  public extractCitationsFromText(fullResponse: string): ParsedClauseReference[] {
    return extractAllCitations(fullResponse);
  }

  public buildLink(params: DeepLinkParams): string {
    return buildDeepLink(params);
  }

  public resolveUrl(url: string): ResolvedDeepLink {
    return parseDeepLinkUrl(url);
  }

  public trackCitation(record: ClauseCitationRecord): void {
    this.reverseIndex.recordCitation(record);
  }

  public getMostCitedClauses(topN: number = 10) {
    return this.reverseIndex.getMostCitedClauses(topN);
  }
}
