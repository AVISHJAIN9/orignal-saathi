import { useTranslation } from "react-i18next";
import {
  FileWarning,
  Calendar,
  Building2,
  Clock,
  ArrowRight,
  ChevronRight,
  Scale,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import type { LicenseNotice } from "@/lib/license-actions-api";
import { LicenseStatusBadge, NoticeTypeBadge } from "./license-status-badge";

interface LicenseNoticeCardProps {
  notice: LicenseNotice;
  onViewDetails: (notice: LicenseNotice) => void;
  onOpenRemediation?: (notice: LicenseNotice) => void;
}

export function LicenseNoticeCard({
  notice,
  onViewDetails,
  onOpenRemediation,
}: LicenseNoticeCardProps) {
  const { t } = useTranslation(["licenseActions"]);

  const isSuspended =
    notice.status === "SUSPENDED" || notice.status === "REMEDIATION_REQUIRED";

  return (
    <Card
      className={`overflow-hidden border backdrop-blur-sm shadow-sm transition-all hover:shadow-md ${
        isSuspended
          ? "border-destructive/40 bg-card ring-1 ring-destructive/20"
          : "border-border/70 bg-card/80"
      }`}
    >
      <CardContent className="p-5 flex flex-col gap-4">
        {/* Top bar: Status, Type, Notice number, Effective Date */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2.5">
            <LicenseStatusBadge status={notice.status} />
            <NoticeTypeBadge type={notice.noticeType} />
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
            <span className="font-semibold text-foreground">{notice.noticeNumber}</span>
            <span>·</span>
            <span>Effective: {new Date(notice.effectiveDate).toLocaleDateString("en-IN")}</span>
          </div>
        </div>

        {/* Product & License info */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {notice.productName} ({notice.modelNumber})
            </h3>
            <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
              License: {notice.certificateNumber}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{notice.standardNumber}</span>
            <span>·</span>
            <span>{notice.issuingBranch}</span>
          </div>
        </div>

        {/* Enforcement Grounds / Reason */}
        <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50 text-xs">
          <span className="font-bold text-foreground uppercase tracking-wider text-2xs text-primary block mb-1">
            {t("licenseActions:card.reason")}
          </span>
          <p className="text-muted-foreground leading-relaxed line-clamp-2">
            {notice.reasonSummary}
          </p>
        </div>

        {/* Deadline & directives preview */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-destructive font-bold">
            <Clock className="size-3.5" />
            <span>Remediation Deadline: {new Date(notice.remediationDeadline).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>

          <span className="font-mono text-2xs text-muted-foreground">
            Order: {notice.officialOrderRef}
          </span>
        </div>

        {/* Card Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            {notice.appealEligible && (
              <Link to="/appeals">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                >
                  <Scale className="size-3.5" />
                  <span>{t("licenseActions:card.viewAppeals")}</span>
                </Button>
              </Link>
            )}

            <Link to="/certificates">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground"
              >
                <Award className="size-3.5" />
                <span>Certificate</span>
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(notice)}
              className="h-8 text-xs font-semibold"
            >
              <span>{t("licenseActions:card.viewNotice")}</span>
            </Button>

            {notice.status !== "REINSTATED" && notice.status !== "CLOSED" && (
              <Button
                size="sm"
                onClick={() => {
                  if (onOpenRemediation) onOpenRemediation(notice);
                  else onViewDetails(notice);
                }}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <span>{t("licenseActions:card.openRemediation")}</span>
                <ArrowRight className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
