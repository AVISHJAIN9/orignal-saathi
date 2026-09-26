// S20 — pure client-side .ics export. This is deliberately NOT a
// mock-*.ts stand-in for a future endpoint: S2's DashboardDeadline[]
// (mock-dashboard.ts) is already the real data source the dashboard
// renders, and generating a calendar file from it is something a browser
// can do entirely on its own — there is no backend step to stand in for,
// today or later.

import type { DashboardDeadline } from "@/lib/mock-dashboard";

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

// All-day VEVENTs use a DATE (not DATE-TIME) value — "YYYYMMDD" — per
// RFC 5545. `dueDate` is always a plain "YYYY-MM-DD" string (see
// mock-dashboard.ts), so this parses it as a local date rather than UTC
// to avoid an off-by-one day near midnight in timezones behind UTC.
function toIcsDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

// DTEND is exclusive for all-day events per RFC 5545 — one calendar day
// after DTSTART, so the event covers exactly the due date and not two days.
function toIcsDateNextDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function utcStamp(): string {
  const d = new Date();
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
    `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function buildEvent(deadline: DashboardDeadline): string {
  return [
    "BEGIN:VEVENT",
    `UID:${deadline.key}@saathi.prototype`,
    `DTSTAMP:${utcStamp()}`,
    `DTSTART;VALUE=DATE:${toIcsDate(deadline.dueDate)}`,
    `DTEND;VALUE=DATE:${toIcsDateNextDay(deadline.dueDate)}`,
    `SUMMARY:${escapeIcsText(deadline.label)}`,
    `DESCRIPTION:${escapeIcsText(
      "SAATHI prototype — illustrative example deadline, not a real BIS filing deadline.",
    )}`,
    "END:VEVENT",
  ].join("\r\n");
}

/**
 * Builds an RFC 5545 calendar (one all-day VEVENT per deadline) entirely
 * client-side from S2's real DashboardDeadline[] — no backend call, no
 * new data source.
 */
export function buildIcsCalendar(deadlines: DashboardDeadline[]): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SAATHI Prototype//Deadline Export//EN",
    "CALSCALE:GREGORIAN",
    ...deadlines.map(buildEvent),
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Triggers a browser download of the given .ics content — generated and
 * saved entirely in-browser, no server round-trip. */
export function downloadIcsFile(filename: string, icsContent: string) {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
