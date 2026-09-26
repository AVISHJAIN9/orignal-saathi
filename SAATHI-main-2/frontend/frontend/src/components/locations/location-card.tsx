import { useTranslation } from "react-i18next";
import {
  Building2,
  MapPin,
  Award,
  Calendar,
  ClipboardCheck,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ManufacturingPlant } from "@/lib/demo/s26-demo-data";

interface LocationCardProps {
  plant: ManufacturingPlant;
  isActive: boolean;
  onSetActive: (plantId: string) => void;
  onViewDetails: (plant: ManufacturingPlant) => void;
}

export function LocationCard({
  plant,
  isActive,
  onSetActive,
  onViewDetails,
}: LocationCardProps) {
  const { t } = useTranslation(["locations"]);

  const hasScheduledAudit = plant.audits.some((a) => a.status === "SCHEDULED");

  return (
    <Card
      className={`border backdrop-blur-sm transition-all hover:shadow-md ${
        isActive
          ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
          : "border-border/70 bg-card/70"
      }`}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Header: Plant code, primary tag, active badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-foreground bg-primary/10 text-primary px-2.5 py-0.5 rounded">
              {plant.code}
            </span>
            {plant.isPrimary && (
              <Badge variant="secondary" className="text-2xs font-bold uppercase">
                {t("locations:card.primary")}
              </Badge>
            )}
            {isActive && (
              <span className="flex items-center gap-1 font-mono text-2xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                <CheckCircle2 className="size-3" />
                <span>ACTIVE SCOPE</span>
              </span>
            )}
          </div>

          <span className="text-xs text-muted-foreground font-mono">
            {plant.address.city}, {plant.address.state}
          </span>
        </div>

        {/* Plant Title & Address */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
            {plant.name}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="size-3 text-primary shrink-0" />
            <span className="truncate">
              {plant.address.line1}, {plant.address.industrialArea}
            </span>
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl border border-border/60 bg-background/80 text-xs">
          <div>
            <span className="text-muted-foreground block text-2xs uppercase font-semibold">
              Compliance
            </span>
            <span className="font-mono font-bold text-foreground text-sm">
              {plant.complianceScore}%
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-2xs uppercase font-semibold">
              Licenses Active
            </span>
            <span className="font-mono font-bold text-primary text-sm">
              {plant.licenses.length}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-2xs uppercase font-semibold">
              Next Audit
            </span>
            <span className={`font-semibold text-xs ${hasScheduledAudit ? "text-amber-600 dark:text-amber-400 font-bold" : "text-muted-foreground"}`}>
              {hasScheduledAudit ? "Scheduled" : "Up to date"}
            </span>
          </div>
        </div>

        {/* Licenses Tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {plant.licenses.map((lic) => (
            <span
              key={lic.certificateNumber}
              className="font-mono text-2xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground border border-border/50"
            >
              {lic.certificateNumber} ({lic.standardNumber})
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSetActive(plant.id)}
            disabled={isActive}
            className={`h-8 text-xs font-semibold ${isActive ? "text-emerald-600" : "text-muted-foreground hover:text-foreground"}`}
          >
            {isActive ? "Currently Selected" : "Select as Active Scope"}
          </Button>

          <Button
            size="sm"
            onClick={() => onViewDetails(plant)}
            className="h-8 text-xs font-semibold gap-1"
          >
            <span>{t("locations:card.viewDetails")}</span>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
