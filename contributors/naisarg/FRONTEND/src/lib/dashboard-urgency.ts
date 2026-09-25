// Pure presentation rule, not a business rule: mapping a real
// days-remaining number (computed from a real due date in
// mock-dashboard.ts) onto one of four urgency tiers is a UI concern, the
// same way readiness-percent color bands elsewhere in this app are — it
// never decides *whether* something is due, only how urgently to display
// a due date the data layer already resolved. See the S2 task's explicit
// carve-out for this one kind of date-math-to-label mapping.

export type UrgencyTier = "normal" | "approaching" | "urgent" | "overdue";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Whole days between `now` and `dueDate` — negative once the date has passed. */
export function daysRemaining(dueDate: string, now: Date = new Date()): number {
  const due = new Date(dueDate);
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  return Math.round((startOfDue.getTime() - startOfNow.getTime()) / MS_PER_DAY);
}

export function getUrgencyTier(days: number): UrgencyTier {
  if (days < 0) return "overdue";
  if (days <= 3) return "urgent";
  if (days <= 14) return "approaching";
  return "normal";
}

/** Overdue must always read "N days overdue", never a negative countdown. */
export function formatDaysRemaining(days: number): {
  key: string;
  count: number;
} {
  if (days < 0) return { key: "overdue", count: Math.abs(days) };
  if (days === 0) return { key: "dueToday", count: 0 };
  return { key: "dueInDays", count: days };
}
