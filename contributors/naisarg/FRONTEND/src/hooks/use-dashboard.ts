// Aggregates every dashboard data piece behind one hook so components
// don't each fetch independently (see the S2 task's explicit
// requirement). Built on Promise.allSettled specifically so one failed
// section (a real backend endpoint being down) can't blank out sections
// that succeeded — the same defensive shape compliance-gap-analyzer.tsx's
// try/catch already uses for a single async call, just extended to five
// running in parallel.
//
// mock-dashboard.ts's functions never actually reject today (same as
// every other mock-*.ts module in this app — see
// compliance-gap-analyzer.tsx's runAnalysis, whose catch branch is real
// but never exercised by the deterministic mock either). The
// "error"/"partial" branches below are still real, correct code paths a
// future backend swap will exercise — not dead code, just not something
// this demo forces to fire.

import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/lib/auth";
import {
  getActionRequiredItems,
  getApplications,
  getDeadlines,
  getPaymentAlerts,
  getRecentActivity,
  getRegulatoryAlerts,
  getStatusSummary,
  type ActivityDatum,
  type DashboardApplication,
  type DashboardDeadline,
  type StatusSummary,
} from "@/lib/mock-dashboard";
import type { NotificationDatum } from "@/lib/mock-notifications";
import { useRole } from "@/lib/role";

export type DashboardSectionKey =
  | "applications"
  | "deadlines"
  | "actionRequired"
  | "regulatoryAlerts"
  | "recentActivity"
  // S5 — additive, same as every other section key above.
  | "paymentAlerts";

export interface DashboardData {
  statusSummary: StatusSummary;
  applications: DashboardApplication[];
  deadlines: DashboardDeadline[];
  actionRequired: NotificationDatum[];
  regulatoryAlerts: NotificationDatum[];
  recentActivity: ActivityDatum[];
  paymentAlerts: NotificationDatum[];
}

export type DashboardStatus =
  "loading" | "success" | "partial" | "empty" | "error";

export interface UseDashboardResult {
  status: DashboardStatus;
  data: DashboardData | null;
  failedSections: DashboardSectionKey[];
  errorMessage: string | null;
  retry: () => void;
  retrySection: (section: DashboardSectionKey) => void;
}

const GENERIC_ERROR_MESSAGE =
  "We couldn't load your dashboard. Please try again.";

function isEverythingEmpty(data: DashboardData): boolean {
  return (
    data.applications.length === 0 &&
    data.deadlines.length === 0 &&
    data.actionRequired.length === 0 &&
    data.regulatoryAlerts.length === 0 &&
    data.recentActivity.length === 0 &&
    data.paymentAlerts.length === 0
  );
}

function deriveStatus(
  data: DashboardData,
  failedSections: DashboardSectionKey[],
): DashboardStatus {
  if (failedSections.length > 0) return "partial";
  if (isEverythingEmpty(data)) return "empty";
  return "success";
}

export function useDashboard(): UseDashboardResult {
  const { currentUser } = useAuth();
  const { role } = useRole();

  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [failedSections, setFailedSections] = useState<DashboardSectionKey[]>(
    [],
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Guards against a stale, in-flight `load()` overwriting a newer one's
  // result (e.g. a fast retry double-click), same pattern App.tsx's
  // sequential timeouts avoid via a ref rather than a race-prone effect.
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    if (!currentUser) return;
    const requestId = ++requestIdRef.current;
    setStatus("loading");
    setErrorMessage(null);

    const results = await Promise.allSettled([
      getApplications(currentUser, role),
      getDeadlines(role),
      getActionRequiredItems(role),
      getRegulatoryAlerts(role),
      getRecentActivity(role),
      getPaymentAlerts(role),
    ]);
    if (requestId !== requestIdRef.current) return;

    const [applicationsR, deadlinesR, actionR, alertsR, activityR, paymentR] =
      results;
    const failed: DashboardSectionKey[] = [];

    const applications =
      applicationsR.status === "fulfilled"
        ? applicationsR.value
        : (failed.push("applications"), []);
    const deadlines =
      deadlinesR.status === "fulfilled"
        ? deadlinesR.value
        : (failed.push("deadlines"), []);
    const actionRequired =
      actionR.status === "fulfilled"
        ? actionR.value
        : (failed.push("actionRequired"), []);
    const regulatoryAlerts =
      alertsR.status === "fulfilled"
        ? alertsR.value
        : (failed.push("regulatoryAlerts"), []);
    const recentActivity =
      activityR.status === "fulfilled"
        ? activityR.value
        : (failed.push("recentActivity"), []);
    const paymentAlerts =
      paymentR.status === "fulfilled"
        ? paymentR.value
        : (failed.push("paymentAlerts"), []);

    if (failed.length === results.length) {
      setStatus("error");
      setErrorMessage(GENERIC_ERROR_MESSAGE);
      setData(null);
      setFailedSections([]);
      return;
    }

    const nextData: DashboardData = {
      statusSummary: getStatusSummary(applications),
      applications,
      deadlines,
      actionRequired,
      regulatoryAlerts,
      recentActivity,
      paymentAlerts,
    };
    setData(nextData);
    setFailedSections(failed);
    setStatus(deriveStatus(nextData, failed));
  }, [currentUser, role]);

  useEffect(() => {
    void load();
  }, [load]);

  async function retrySection(section: DashboardSectionKey) {
    if (!currentUser || !data) return;
    try {
      let value: unknown;
      if (section === "applications")
        value = await getApplications(currentUser, role);
      else if (section === "deadlines") value = await getDeadlines(role);
      else if (section === "actionRequired")
        value = await getActionRequiredItems(role);
      else if (section === "regulatoryAlerts")
        value = await getRegulatoryAlerts(role);
      else if (section === "recentActivity")
        value = await getRecentActivity(role);
      else value = await getPaymentAlerts(role);

      const nextData: DashboardData = {
        ...data,
        [section]: value,
      } as DashboardData;
      nextData.statusSummary = getStatusSummary(nextData.applications);

      const nextFailed = failedSections.filter((s) => s !== section);
      setData(nextData);
      setFailedSections(nextFailed);
      setStatus(deriveStatus(nextData, nextFailed));
    } catch {
      // Section still failed — leave it in `failedSections` and stay on
      // "partial" (or "error" is unreachable here since `data` already
      // exists, so at least one section previously succeeded).
    }
  }

  return {
    status,
    data,
    failedSections,
    errorMessage,
    retry: () => void load(),
    retrySection: (section) => void retrySection(section),
  };
}
