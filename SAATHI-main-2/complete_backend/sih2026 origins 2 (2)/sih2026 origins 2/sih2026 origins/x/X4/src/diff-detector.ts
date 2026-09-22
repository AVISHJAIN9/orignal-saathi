import {
  BisCircularItem,
  computeSha256,
  DiffDetectionResult,
  StandardClauseChunk,
  StandardDocumentVersion,
} from './crawler.types';

export class DiffDetector {
  public computeChecksum(text: string): string {
    return computeSha256(text);
  }

  public prepareClauseHashes(clauses: StandardClauseChunk[]): StandardClauseChunk[] {
    return clauses.map((clause) => ({
      ...clause,
      clauseHash:
        clause.clauseHash ||
        computeSha256(
          `${clause.clauseNumber}:::${clause.clauseTitle || ''}:::${clause.content}`
        ),
    }));
  }

  public calculateClauseDiff(
    originalClauses: StandardClauseChunk[],
    incomingClauses: StandardClauseChunk[]
  ): DiffDetectionResult {
    const originalWithHashes = this.prepareClauseHashes(originalClauses);
    const incomingWithHashes = this.prepareClauseHashes(incomingClauses);

    const originalMap = new Map<string, StandardClauseChunk>();
    for (const c of originalWithHashes) {
      originalMap.set(c.clauseNumber, c);
    }

    const incomingMap = new Map<string, StandardClauseChunk>();
    for (const c of incomingWithHashes) {
      incomingMap.set(c.clauseNumber, c);
    }

    const addedClauses: StandardClauseChunk[] = [];
    const modifiedClauses: { original: StandardClauseChunk; updated: StandardClauseChunk }[] = [];
    const unchangedClauses: StandardClauseChunk[] = [];
    const removedClauseNumbers: string[] = [];

    for (const incoming of incomingWithHashes) {
      const orig = originalMap.get(incoming.clauseNumber);
      if (!orig) {
        addedClauses.push(incoming);
      } else if (orig.clauseHash !== incoming.clauseHash) {
        modifiedClauses.push({ original: orig, updated: incoming });
      } else {
        unchangedClauses.push(incoming);
      }
    }

    for (const orig of originalWithHashes) {
      if (!incomingMap.has(orig.clauseNumber)) {
        removedClauseNumbers.push(orig.clauseNumber);
      }
    }

    const changedClauses: StandardClauseChunk[] = [
      ...addedClauses,
      ...modifiedClauses.map((m) => m.updated),
    ];

    const reEmbeddingRequiredCount = changedClauses.length;
    const hasChanges = reEmbeddingRequiredCount > 0 || removedClauseNumbers.length > 0;

    let mdReport = `### Standard Revision Diff Analysis\n`;
    mdReport += `- **Unchanged Clauses:** ${unchangedClauses.length}\n`;
    mdReport += `- **Modified Clauses:** ${modifiedClauses.length}\n`;
    mdReport += `- **Newly Added Clauses:** ${addedClauses.length}\n`;
    mdReport += `- **Removed Clauses:** ${removedClauseNumbers.length}\n\n`;

    if (modifiedClauses.length > 0) {
      mdReport += `#### Modified Clauses Detail\n`;
      for (const mod of modifiedClauses) {
        mdReport += `- **Clause ${mod.updated.clauseNumber}**:\n  - Old: ${mod.original.content}\n  + New: ${mod.updated.content}\n`;
      }
    }

    return {
      hasChanges,
      totalOriginalClauses: originalClauses.length,
      totalNewClauses: incomingClauses.length,
      addedClauses,
      modifiedClauses,
      changedClauses,
      unchangedClauses,
      removedClauseNumbers,
      reEmbeddingRequiredCount,
      markdownDiffReport: mdReport,
    };
  }

  public detectDiffs(
    activeDoc: StandardDocumentVersion,
    circular: BisCircularItem
  ): DiffDetectionResult {
    const incomingClauses: StandardClauseChunk[] = circular.amendedClauses.map((c) => ({
      clauseNumber: c.clauseNumber,
      clauseTitle: c.title,
      content: c.newContent,
    }));

    return this.calculateClauseDiff(activeDoc.clauses, incomingClauses);
  }
}
