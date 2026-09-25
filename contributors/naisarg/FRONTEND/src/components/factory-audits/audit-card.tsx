import { useTranslation } from "react-i18next";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FactoryAudit } from "@/lib/factory-audits-api";
import { AuditStatusBadge } from "./audit-status-badge";

interface AuditCardProps {
  audit: FactoryAudit;
  onViewDetails: (audit: FactoryAudit) => void;
  onConfirmAttendance?: (auditId: string) => void;
  onRequestReschedule?: (audit: FactoryAudit) => void;
}

export function AuditCard({
  audit,
  onViewDetails,
  onConfirmAttendance,
  onRequestReschedule,
}: AuditCardProps) {
  const { t } = useTranslation(["audits"]);

  const totalItems = audit.preparationItems.length;
  const readyItems = audit.preparationItems.filter((i) => i.isReady).length;
  const progressPercent = totalItems > 0 ? Math.round((readyItems / totalItems) * 100) : 100;

  return (
    <Card className="overflow-hidden border border-border/70 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-5 flex flex-col gap-4">
        {/* Top row: Status, Audit No, Type */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <AuditStatusBadge status={audit.status} />
            <span className="font-mono text-xs font-bold text-muted-foreground">
              {audit.auditNumber}
            </span>
          </div>

          <span className="font-mono text-2xs font-semibold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
            {audit.auditType.replace(/_/g, " ")}
          </span>
        </div>

        {/* Product & Standard info */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {audit.productName} ({audit.modelNumber})
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
              {audit.standardNumber}
            </span>
            <span className="text-xs text-muted-foreground">
              {audit.standardTitle}
            </span>
          </div>
        </div>

        {/* Key schedule details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CalendarIcon className="size-4 text-primary shrink-0" />
            <span>
              {new Date(audit.scheduledDate).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4 shrink-0" />
            <span>{audit.scheduledTime}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="size-4 text-blue-600 shrink-0" />
            <span className="truncate">{audit.leadOfficer.name} ({audit.leadOfficer.designation})</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground truncate">
            <MapPin className="size-4 text-amber-600 shrink-0" />
            <span className="truncate">{audit.plantCity}, {audit.plantState}</span>
          </div>
        </div>

        {/* Preparation Progress Bar */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-muted/30 border border-border/40">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              {t("audits:card.readinessScore")}: {progressPercent}%
            </span>
            <span className="font-mono text-muted-foreground">
              {readyItems}/{totalItems} items ready
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                progressPercent === 100
                  ? "bg-emerald-500"
                  : progressPercent > 50
                  ? "bg-primary"
                  : "bg-amber-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            {audit.status !== "CONFIRMED" && onConfirmAttendance && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onConfirmAttendance(audit.id)}
                className="text-xs h-8 gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30"
              >
                <CheckCircle2 className="size-3.5" />
                <span>{t("audits:card.confirmAttendance")}</span>
              </Button>
            )}

            {onRequestReschedule && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRequestReschedule(audit)}
                className="text-xs h-8 gap-1 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                <span>{t("audits:card.requestReschedule")}</span>
              </Button>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => onViewDetails(audit)}
            className="text-xs h-8 gap-1.5 font-semibold"
          >
            <span>{t("audits:card.viewAndCoordinate")}</span>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
