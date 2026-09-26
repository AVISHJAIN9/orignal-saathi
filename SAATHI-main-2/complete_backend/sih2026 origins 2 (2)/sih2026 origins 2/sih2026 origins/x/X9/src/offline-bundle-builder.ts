import * as crypto from 'crypto';
import { OfflineFaqEntry, OfflineStandardEntry, OfflineSyncBundle } from './offline-sync.types';

export class OfflineBundleBuilder {
  private readonly version = '1.0.0-20260831';

  /**
   * Pre-compiles top high-demand Indian Standards for MSMEs
   */
  public getTopOfflineStandards(): OfflineStandardEntry[] {
    return [
      {
        standardNumber: 'IS 10500:2012',
        title: 'Drinking Water Specification',
        category: 'Food & Water',
        scopeSummary: 'Prescribes quality criteria for packaged & municipal drinking water in India.',
        isMandatoryUnderQCO: true,
        keyClauses: [
          { clauseNumber: '4.1', title: 'Bacteriological Quality', summary: 'E. Coli must be absent in 100ml sample.' },
          { clauseNumber: 'Table 1', title: 'Physical Parameters', summary: 'TDS max 500 mg/l (acceptable), 2000 mg/l (permissible).' },
        ],
      },
      {
        standardNumber: 'IS 456:2000',
        title: 'Plain and Reinforced Concrete',
        category: 'Civil & Construction',
        scopeSummary: 'General structural use of concrete and quality specifications.',
        isMandatoryUnderQCO: true,
        keyClauses: [
          { clauseNumber: 'Table 2', title: 'Concrete Grades', summary: 'Specifies 28-day characteristic compressive strength.' },
        ],
      },
      {
        standardNumber: 'IS 1293:2019',
        title: 'Plugs and Socket-Outlets',
        category: 'Electrotechnical',
        scopeSummary: 'Safety requirements for domestic plugs and socket outlets.',
        isMandatoryUnderQCO: true,
        keyClauses: [
          { clauseNumber: 'Clause 8', title: 'Marking', summary: 'Mandatory ISI mark and rating specification.' },
        ],
      },
      {
        standardNumber: 'IS 13252 (Part 1):2010',
        title: 'Information Technology Equipment - Safety',
        category: 'Electronics & IT',
        scopeSummary: 'Safety of mains-powered or battery-powered IT equipment.',
        isMandatoryUnderQCO: true,
        keyClauses: [
          { clauseNumber: 'Clause 1.2', title: 'Scope', summary: 'Mandatory registration under CRS Scheme-II.' },
        ],
      },
      {
        standardNumber: 'IS 9873 (Part 1):2019',
        title: 'Safety of Toys',
        category: 'Consumer Products',
        scopeSummary: 'Mechanical and physical properties safety requirements for children toys.',
        isMandatoryUnderQCO: true,
        keyClauses: [
          { clauseNumber: 'Clause 4', title: 'General Requirements', summary: 'Mandatory Scheme-I certification under Toys QCO 2020.' },
        ],
      },
    ];
  }

  /**
   * Pre-compiles frequently asked compliance FAQs
   */
  public getFrequentFaqs(): OfflineFaqEntry[] {
    return [
      {
        faqId: 'FAQ-001',
        question: 'What is the fee concession for micro scale industries in BIS?',
        answer: 'Micro enterprises receive a 50% concession on application fee and annual minimum marking fee under Scheme-I.',
        category: 'FEE_STRUCTURE',
        keywords: ['fee', 'concession', 'micro', 'discount', 'msme'],
      },
      {
        faqId: 'FAQ-002',
        question: 'How do I verify if my product requires mandatory BIS certification?',
        answer: 'Check the official Quality Control Orders (QCO) gazette notifications published by the relevant Ministry or search the product on SAATHI.',
        category: 'QCO_COMPLIANCE',
        keywords: ['mandatory', 'qco', 'compulsory', 'license'],
      },
      {
        faqId: 'FAQ-003',
        question: 'What is the difference between ISI Mark (Scheme-I) and CRS (Scheme-II)?',
        answer: 'ISI Mark involves factory audits and sample testing before license grant. CRS (Compulsory Registration Scheme) requires self-declaration of conformity based on lab test reports without mandatory pre-license factory audit.',
        category: 'SCHEME_TYPES',
        keywords: ['isi', 'crs', 'difference', 'scheme-i', 'scheme-ii'],
      },
    ];
  }

  /**
   * Builds the inverted search index for instant offline querying in browser Service Worker / IndexedDB
   */
  public buildOfflineIndex(
    standards: OfflineStandardEntry[],
    faqs: OfflineFaqEntry[]
  ): Record<string, string[]> {
    const termMap: Record<string, Set<string>> = {};

    const addTerm = (term: string, ref: string) => {
      const clean = term.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length < 3) return;
      if (!termMap[clean]) termMap[clean] = new Set();
      termMap[clean].add(ref);
    };

    for (const std of standards) {
      addTerm(std.standardNumber, std.standardNumber);
      std.title.split(/\s+/).forEach((w) => addTerm(w, std.standardNumber));
      std.category.split(/\s+/).forEach((w) => addTerm(w, std.standardNumber));
    }

    for (const faq of faqs) {
      faq.keywords.forEach((k) => addTerm(k, faq.faqId));
      faq.question.split(/\s+/).forEach((w) => addTerm(w, faq.faqId));
    }

    const result: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(termMap)) {
      result[k] = Array.from(v);
    }
    return result;
  }

  /**
   * Assembles complete offline synchronization bundle
   */
  public buildBundle(): OfflineSyncBundle {
    const topStandards = this.getTopOfflineStandards();
    const frequentFaqs = this.getFrequentFaqs();
    const offlineSearchTerms = this.buildOfflineIndex(topStandards, frequentFaqs);

    const rawPayload = JSON.stringify({
      version: this.version,
      topStandards,
      frequentFaqs,
      offlineSearchTerms,
    });

    const bundleChecksum = crypto.createHash('sha256').update(rawPayload).digest('hex');

    return {
      bundleVersion: this.version,
      bundleChecksum,
      generatedAt: new Date().toISOString(),
      topStandards,
      frequentFaqs,
      offlineSearchTerms,
      clientCacheTtlSeconds: 86400 * 7, // 7 days cache validity
    };
  }
}
