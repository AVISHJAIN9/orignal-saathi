// MOCK: illustrative usage-analytics data for the admin dashboard (D6).
// Swap for real analytics API calls once a backend exists — nothing else in
// AdminDashboard needs to change, since it only consumes these shaped
// exports the same way mock-bot.ts stands in for a real chat API.

export const MOCK_GROUNDEDNESS_RATE = 87;
export const MOCK_DECLINE_RATE = 13;

export interface TopicDatum {
  key: string;
  count: number;
}

export const MOCK_TOPICS: TopicDatum[] = [
  { key: "helmets", count: 342 },
  { key: "appliances", count: 298 },
  { key: "gold", count: 256 },
  { key: "water", count: 189 },
  { key: "cookers", count: 164 },
  { key: "toys", count: 121 },
];

// Kept as a derived sum (rather than a separate hardcoded constant) so the
// "Total Queries" KPI can never drift out of sync with the topic breakdown
// it's summarizing.
export const MOCK_TOTAL_QUERIES = MOCK_TOPICS.reduce((sum, topic) => sum + topic.count, 0);

// Mock period-over-period change shown as the small trend arrow on each KPI
// card. `isPositive` drives the green/red color and is independent of the
// arrow direction (`changePercent`'s sign) — e.g. a falling decline rate is
// still good news even though the arrow points down.
export interface KpiTrend {
  changePercent: number;
  isPositive: boolean;
}

export const MOCK_GROUNDEDNESS_TREND: KpiTrend = { changePercent: 4, isPositive: true };
export const MOCK_DECLINE_TREND: KpiTrend = { changePercent: 1, isPositive: false };
export const MOCK_TOTAL_QUERIES_TREND: KpiTrend = { changePercent: 8, isPositive: true };

export interface DailyQueryDatum {
  key: string;
  count: number;
}

export const MOCK_DAILY_QUERIES: DailyQueryDatum[] = [
  { key: "mon", count: 145 },
  { key: "tue", count: 168 },
  { key: "wed", count: 152 },
  { key: "thu", count: 201 },
  { key: "fri", count: 187 },
  { key: "sat", count: 134 },
  { key: "sun", count: 176 },
];
