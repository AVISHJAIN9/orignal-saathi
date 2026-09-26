import {
  BisCircularItem,
  computeSha256,
  DocumentLifecycleStatus,
  StandardClauseChunk,
  StandardDocumentVersion,
} from './crawler.types';

export class DocumentLifecycleManager {
  private readonly documentStore: Map<string, StandardDocumentVersion> = new Map();

  constructor() {
    this.seedDefaultStandards();
  }

  private seedDefaultStandards(): void {
    this.registerStandard(
      'IS 10500:2012',
      'Drinking Water Specification',
      'Second Revision',
      2012,
      '2012-05-01',
      [
        {
          clauseNumber: '4.1',
          clauseTitle: 'Bacteriological Quality',
          content: 'E. Coli must not be detectable in 100ml sample.',
        },
        {
          clauseNumber: '4.2',
          clauseTitle: 'TDS Limits',
          content: 'TDS acceptable limit is 500 mg/l.',
        },
      ]
    );
  }

  public generateDocumentId(standardNumber: string, year: number, edition: string): string {
    const cleanStd = standardNumber.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
    return `DOC_${cleanStd}_${year}_${edition.replace(/\s+/g, '_')}`;
  }

  public registerStandard(
    standardNumber: string,
    title: string,
    edition: string,
    year: number,
    effectiveFrom: string,
    clauses: StandardClauseChunk[]
  ): StandardDocumentVersion {
    const documentId = this.generateDocumentId(standardNumber, year, edition);
    const fullText = `${standardNumber} ${title} ${clauses.map((c) => c.content).join(' ')}`;
    const fullDocumentChecksum = computeSha256(fullText);
    const now = new Date().toISOString();

    const doc: StandardDocumentVersion = {
      documentId,
      standardNumber,
      title,
      edition,
      year,
      status: 'ACTIVE',
      effectiveFrom,
      fullDocumentChecksum,
      clauses,
      createdAt: now,
      updatedAt: now,
    };

    this.documentStore.set(documentId, doc);
    return doc;
  }

  public createNewVersion(
    activeDoc: StandardDocumentVersion,
    circular: BisCircularItem
  ): StandardDocumentVersion {
    const newYear = new Date().getFullYear();
    const newEdition = `${activeDoc.edition} (Amended)`;
    const newDocId = this.generateDocumentId(activeDoc.standardNumber, newYear, newEdition);

    // Merge clauses
    const clauseMap = new Map<string, StandardClauseChunk>();
    for (const c of activeDoc.clauses) {
      clauseMap.set(c.clauseNumber, { ...c });
    }
    for (const amended of circular.amendedClauses) {
      clauseMap.set(amended.clauseNumber, {
        clauseNumber: amended.clauseNumber,
        clauseTitle: amended.title || clauseMap.get(amended.clauseNumber)?.clauseTitle,
        content: amended.newContent,
      });
    }

    const mergedClauses = Array.from(clauseMap.values());
    const fullText = `${activeDoc.standardNumber} ${activeDoc.title} ${mergedClauses.map((c) => c.content).join(' ')}`;
    const fullChecksum = computeSha256(fullText);
    const now = new Date().toISOString();

    // Mark previous as SUPERSEDED
    activeDoc.status = 'SUPERSEDED';
    activeDoc.supersededByDocumentId = newDocId;
    activeDoc.updatedAt = now;
    this.documentStore.set(activeDoc.documentId, activeDoc);

    // Register new ACTIVE document
    const newDoc: StandardDocumentVersion = {
      documentId: newDocId,
      standardNumber: activeDoc.standardNumber,
      title: activeDoc.title,
      edition: newEdition,
      year: newYear,
      status: 'ACTIVE',
      supersedesDocumentId: activeDoc.documentId,
      effectiveFrom: circular.publishedDate,
      fullDocumentChecksum: fullChecksum,
      clauses: mergedClauses,
      createdAt: now,
      updatedAt: now,
    };

    this.documentStore.set(newDocId, newDoc);
    return newDoc;
  }

  public getActiveVersion(standardNumber: string): StandardDocumentVersion | null {
    const cleanQuery = standardNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const doc of this.documentStore.values()) {
      const cleanStd = doc.standardNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanStd.includes(cleanQuery) && doc.status === 'ACTIVE') {
        return doc;
      }
    }
    return null;
  }

  public getActiveStandard(standardNumber: string): StandardDocumentVersion | null {
    return this.getActiveVersion(standardNumber);
  }

  public getVersionHistory(standardNumber: string): StandardDocumentVersion[] {
    const cleanQuery = standardNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    const history: StandardDocumentVersion[] = [];
    for (const doc of this.documentStore.values()) {
      const cleanStd = doc.standardNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanStd.includes(cleanQuery)) {
        history.push(doc);
      }
    }
    return history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getStandardHistory(standardNumber: string): StandardDocumentVersion[] {
    return this.getVersionHistory(standardNumber);
  }

  public getById(documentId: string): StandardDocumentVersion | null {
    return this.documentStore.get(documentId) || null;
  }
}
