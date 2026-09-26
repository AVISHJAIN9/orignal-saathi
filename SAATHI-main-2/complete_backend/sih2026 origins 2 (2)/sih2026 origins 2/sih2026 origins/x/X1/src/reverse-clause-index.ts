export interface ClauseCitationRecord {
  standardNumber: string;
  clauseNumber: string;
  queryText: string;
  conversationId?: string;
  timestamp: string;
}

/**
 * In-memory / persistent reverse index mapping Standard Clause -> All User Queries that cited it
 * Used by Analytics (X8) and Caching (X9)
 */
export class ReverseClauseIndex {
  private readonly index: Map<string, ClauseCitationRecord[]> = new Map();

  private makeKey(standardNumber: string, clauseNumber: string): string {
    return `${standardNumber.trim().toUpperCase()}#${clauseNumber.trim().toLowerCase()}`;
  }

  public recordCitation(record: ClauseCitationRecord): void {
    const key = this.makeKey(record.standardNumber, record.clauseNumber);
    const existing = this.index.get(key) || [];
    existing.push(record);
    this.index.set(key, existing);
  }

  public getQueriesForClause(standardNumber: string, clauseNumber: string): ClauseCitationRecord[] {
    const key = this.makeKey(standardNumber, clauseNumber);
    return this.index.get(key) || [];
  }

  public getMostCitedClauses(topN: number = 10): Array<{ standardNumber: string; clauseNumber: string; citationCount: number }> {
    const results: Array<{ standardNumber: string; clauseNumber: string; citationCount: number }> = [];

    for (const [key, records] of this.index.entries()) {
      const [standardNumber, clauseNumber] = key.split('#');
      results.push({
        standardNumber,
        clauseNumber,
        citationCount: records.length,
      });
    }

    return results.sort((a, b) => b.citationCount - a.citationCount).slice(0, topN);
  }

  public clear(): void {
    this.index.clear();
  }
}
