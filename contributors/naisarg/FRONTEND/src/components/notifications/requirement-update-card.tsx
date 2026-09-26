import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Info,
  Link2,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type {
  NotificationDatum,
  RequirementUpdateSeverity,
} from "@/lib/mock-notifications";
import { getStandardByKey } from "@/lib/mock-standards";
import { cn } from "@/lib/utils";

// The prototype only ever links to BIS's general portal, never a
// fabricated per-document URL — same honesty rule standard-detail.tsx's
// Sources tab and revision-compare.tsx's "Open Source" link follow.
const BIS_PORTAL_URL = "https://www.bis.gov.in";

const SEVERITY_ICONS: Record<RequirementUpdateSeverity, typeof AlertTriangle> =
  {
    high: AlertTriangle,
    medium: AlertCircle,
    low: Info,
  };

const SEVERITY_STYLES: Record<RequirementUpdateSeverity, string> = {
  high: "bg-red-500/15 text-red-700 dark:text-red-400",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  low: "bg-muted text-foreground",
};

interface RequirementUpdateCardProps {
  notification: NotificationDatum;
  index: number;
  onMarkRead: (key: string) => void;
}

/**
 * The "requirement_update" type's own row — kept out of NotificationItem
 * so that component's simple five-type layout doesn't grow a pile of
 * conditionals for one richer type. Renders only from `requirementUpdate`
 * (reused C2 RevisionChange fields, see mock-notifications.ts) — nothing
 * here re-derives severity, impact, or a compliance/readiness verdict of
 * its own; the three action links only navigate to C2/C3/C4's own
 * existing tabs.
 */
export function RequirementUpdateCard({
  notification,
  index,
  onMarkRead,
}: RequirementUpdateCardProps) {
  const { t } = useTranslation("notifications");
  const update = notification.requirementUpdate;
  if (!update) return null;

  const standard = notification.standardKey
    ? getStandardByKey(notification.standardKey)
    : undefined;
  const SeverityIcon = SEVERITY_ICONS[update.severity];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.06,
      }}
    >
      <Card
        className={cn(
          "elevation-1 elevation-transition border-border py-0 transition-colors",
          !notification.read && "border-primary/25 bg-primary/[0.03]",
        )}
      >
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-2xs font-semibold uppercase",
                SEVERITY_STYLES[update.severity],
              )}
            >
              <SeverityIcon className="size-3" aria-hidden />
              {t(`requirementUpdate.severity.${update.severity}`)}
            </span>
            <Badge
              variant="outline"
              className="border-transparent bg-muted text-foreground"
            >
              {t("types.requirement_update")}
            </Badge>
            {!notification.read && (
              <span
                className="size-1.5 shrink-0 rounded-full bg-primary"
                aria-hidden
                title={t("tabs.unread")}
              />
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="font-mono text-sm font-semibold text-foreground">
              {standard
                ? t("requirementUpdate.standardClause", {
                    standard: standard.standardNumber,
                    clause: update.change.clause,
                  })
                : update.change.clause}
            </p>
            <p className="text-sm font-medium text-foreground">
              {update.change.clauseTitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-muted/30 p-3">
              <span className="text-xs text-muted-foreground">
                {t("requirementUpdate.beforeLabel")}
              </span>
              <span className="text-sm text-foreground">
                {update.change.previousValue}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-muted/30 p-3">
              <span className="text-xs text-muted-foreground">
                {t("requirementUpdate.afterLabel")}
              </span>
              <span className="text-sm text-foreground">
                {update.change.currentValue}
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-foreground">
            {update.change.whyItMatters}
          </p>

          <a
            href={BIS_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            <Link2 className="size-3" aria-hidden />
            {t("requirementUpdate.sourceLabel")}
          </a>

          {standard && (
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/standards/${notification.standardKey}`}
                search={{ tab: "revision" }}
                className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                {t("requirementUpdate.viewChange")}
                <ArrowUpRight className="size-3" aria-hidden />
              </Link>
              <Link
                to={`/standards/${notification.standardKey}`}
                search={{ tab: "complianceGaps" }}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                {t("requirementUpdate.runGapAnalysis")}
                <ArrowUpRight className="size-3" aria-hidden />
              </Link>
              <Link
                to={`/standards/${notification.standardKey}`}
                search={{ tab: "readiness" }}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                {t("requirementUpdate.checkReadiness")}
                <ArrowUpRight className="size-3" aria-hidden />
              </Link>
            </div>
          )}

          {!notification.read && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => onMarkRead(notification.key)}
              className="w-fit"
            >
              {t("markRead")}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
