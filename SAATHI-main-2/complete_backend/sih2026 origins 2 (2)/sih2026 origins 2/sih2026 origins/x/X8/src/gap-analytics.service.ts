import {
  AnonymizedQueryLog,
  BisMinistryDashboardReport,
  StandardDemandMetric,
  StandardsGapCluster,
} from './analytics.types';
import { PiiSanitizer } from './pii-sanitizer';

export class GapAnalyticsService {
  private readonly sanitizer: PiiSanitizer;
  private readonly queryLogs: AnonymizedQueryLog[] = [];

  constructor(sanitizer?: PiiSanitizer) {
    this.sanitizer = sanitizer || new PiiSanitizer();
  }

  public logQuery(
    rawQuery: string,
    confidenceScore: number,
    wasDeclined: boolean,
    matchedStandardNumber?: string,
    userState?: string
  ): AnonymizedQueryLog {
    const sanitizedText = this.sanitizer.sanitize(rawQuery);
    const queryId = `QRY-LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let matchedIntent: AnonymizedQueryLog['matchedIntent'] = 'UNMATCHED_GAP';
    if (matchedStandardNumber) {
      if (sanitizedText.toLowerCase().includes('fee') || sanitizedText.toLowerCase().includes('cost')) {
        matchedIntent = 'FEE_LAB_PROCEDURE';
      } else if (sanitizedText.toLowerCase().includes('clause') || sanitizedText.toLowerCase().includes('limit')) {
        matchedIntent = 'CLAUSE_REQUIREMENTS';
      } else if (sanitizedText.toLowerCase().includes('mandatory') || sanitizedText.toLowerCase().includes('license')) {
        matchedIntent = 'PRODUCT_COMPLIANCE';
      } else {
        matchedIntent = 'STANDARD_LOOKUP';
      }
    }

    const log: AnonymizedQueryLog = {
      queryId,
      sanitizedQueryText: sanitizedText,
      matchedStandardNumber,
      matchedIntent,
      confidenceScore,
      wasDeclined,
      userState,
      timestamp: new Date().toISOString(),
    };

    this.queryLogs.push(log);
    return log;
  }

  public aggregateStandardDemand(): StandardDemandMetric[] {
    const map = new Map<
      string,
      { count: number; totalConfidence: number; states: Set<string> }
    >();

    for (const log of this.queryLogs) {
      if (log.matchedStandardNumber) {
        const std = log.matchedStandardNumber;
        const current = map.get(std) || { count: 0, totalConfidence: 0, states: new Set() };
        current.count++;
        current.totalConfidence += log.confidenceScore;
        if (log.userState) {
          current.states.add(log.userState);
        }
        map.set(std, current);
      }
    }

    const metrics: StandardDemandMetric[] = [];
    for (const [std, data] of map.entries()) {
      const avgConf = data.totalConfidence / data.count;
      metrics.push({
        standardNumber: std,
        totalQueryCount: data.count,
        averageConfidence: Number(avgConf.toFixed(2)),
        clarityIndex: Math.round(avgConf * 100),
        topUserStates: Array.from(data.states),
      });
    }

    return metrics.sort((a, b) => b.totalQueryCount - a.totalQueryCount);
  }

  public identifyStandardsGaps(): StandardsGapCluster[] {
    const unaddressed = this.queryLogs.filter(
      (l) => !l.matchedStandardNumber || l.wasDeclined
    );

    const topicRules = [
      {
        topic: 'Lithium-ion Battery Swapping & Second-Life Recycling',
        regex: /battery\s*swapping|second\s*life\s*ev|lithium\s*recycling/i,
        division: 'Electrotechnical Division (ETD)',
        committeeCode: 'ETD 51',
      },
      {
        topic: 'Commercial Agricultural Drone Components & Spraying Safety',
        regex: /drone|uav|agricultural\s*sprayer\s*drone/i,
        division: 'Mechanical Engineering Division (MED)',
        committeeCode: 'MED 38',
      },
      {
        topic: 'AI Algorithmic Transparency & Healthcare IoT Device Security',
        regex: /ai\s*algorithm|medical\s*iot|smart\s*health\s*sensor/i,
        division: 'Electronics & IT Division (LITD)',
        committeeCode: 'LITD 30',
      },
      {
        topic: 'Biodegradable Plant-Based Plastic Packaging Alternatives',
        regex: /biodegradable\s*packaging|plant\s*based\s*plastic|bioplastic/i,
        division: 'Chemical Division (CHD)',
        committeeCode: 'CHD 34',
      },
    ];

    const clusters: StandardsGapCluster[] = [];

    for (let i = 0; i < topicRules.length; i++) {
      const rule = topicRules[i];
      const matched = unaddressed.filter((q) => rule.regex.test(q.sanitizedQueryText));

      if (matched.length > 0) {
        clusters.push({
          clusterId: `GAP-CLUST-00${i + 1}`,
          productTopic: rule.topic,
          queryCount: matched.length,
          sampleQueries: matched.slice(0, 3).map((m) => m.sanitizedQueryText),
          suggestedCommitteeDivision: rule.division,
          sectionalCommitteeCode: rule.committeeCode,
          urgencyScore: Math.min(10, matched.length * 2),
          recommendation: `Initiate Sectional Committee ${rule.committeeCode} preliminary review for formulation of new Indian Standard for ${rule.topic}.`,
        });
      }
    }

    return clusters.sort((a, b) => b.urgencyScore - a.urgencyScore);
  }

  public generateMinistryReport(): BisMinistryDashboardReport {
    const total = this.queryLogs.length;
    const topStandards = this.aggregateStandardDemand();
    const gaps = this.identifyStandardsGaps();

    const regionalDist: Record<string, number> = {};
    for (const log of this.queryLogs) {
      const state = log.userState || 'National / Unspecified';
      regionalDist[state] = (regionalDist[state] || 0) + 1;
    }

    const ambiguityHotspots = topStandards
      .filter((s) => s.clarityIndex < 60)
      .map((s) => ({
        standardNumber: s.standardNumber,
        lowConfidenceQueryCount: s.totalQueryCount,
        notes: `Frequent low-confidence resolution detected; documentation or FAQ updates recommended for ${s.standardNumber}.`,
      }));

    const groundedCount = this.queryLogs.filter((l) => !l.wasDeclined).length;
    const overallSystemGroundedness = total > 0 ? Number((groundedCount / total).toFixed(2)) : 1.0;

    let briefingText = `EXECUTIVE MEMORANDUM FOR DIRECTOR GENERAL (BIS)\n`;
    briefingText += `Total citizen & MSME queries analyzed: ${total} with ${(overallSystemGroundedness * 100).toFixed(0)}% verified grounding.\n`;
    if (gaps.length > 0) {
      briefingText += `Primary emerging standard gap: "${gaps[0].productTopic}" (Assigned to ${gaps[0].sectionalCommitteeCode}).\n`;
    }

    return {
      reportGeneratedAt: new Date().toISOString(),
      totalQueriesAnalyzed: total,
      overallSystemGroundedness,
      topDemandedStandards: topStandards,
      emergingProductGaps: gaps,
      regionalQueryDistribution: regionalDist,
      documentationAmbiguityHotspots: ambiguityHotspots,
      executiveDgBriefingText: briefingText,
    };
  }
}
