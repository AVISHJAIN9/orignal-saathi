import { useTranslation } from "react-i18next";
import {
  Building2,
  MapPin,
  Award,
  Calendar,
  ClipboardCheck,
  User,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/router-compat";
import type { ManufacturingPlant } from "@/lib/demo/s26-demo-data";
import { locationsApi } from "@/lib/locations-api";

interface LocationDetailsDialogProps {
  plant: ManufacturingPlant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActive: boolean;
  onSetActive: (plantId: string) => void;
}

export function LocationDetailsDialog({
  plant,
  open,
  onOpenChange,
  isActive,
  onSetActive,
}: LocationDetailsDialogProps) {
  const { t } = useTranslation(["locations"]);

  if (!plant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl md:max-w-3xl max-h-[90dvh] overflow-y-auto p-4 sm:p-6 md:p-7">
        <DialogHeader className="gap-2 pb-3 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-primary/10 text-primary">
                {plant.code}
              </span>
              {plant.isPrimary && (
                <Badge variant="secondary" className="text-2xs font-bold uppercase">
                  Primary Headquarters
                </Badge>
              )}
              {isActive && (
                <Badge className="text-2xs bg-emerald-600 text-foreground font-bold uppercase">
                  Active Scope
                </Badge>
              )}
            </div>
          </div>

          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground break-words mt-1">
            {plant.name}
          </DialogTitle>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="size-3.5 text-primary shrink-0" />
            <span>
              {plant.address.line1}, {plant.address.industrialArea}, {plant.address.city}, {plant.address.state} - {plant.address.pincode}
            </span>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-3 text-xs sm:text-sm">
          {/* Plant Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl border border-border/70 bg-card/70 text-xs">
            <div>
              <span className="text-muted-foreground block text-2xs uppercase tracking-wider font-semibold">
                Compliance Score
              </span>
              <span className="font-mono text-xl font-bold text-foreground">
                {plant.complianceScore}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-2xs uppercase tracking-wider font-semibold">
                Jurisdiction
              </span>
              <span className="font-bold text-foreground truncate block">
                {plant.jurisdictionBranch}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-2xs uppercase tracking-wider font-semibold">
                Active Licenses
              </span>
              <span className="font-mono font-bold text-primary">
                {plant.licenses.length} License(s)
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-2xs uppercase tracking-wider font-semibold">
                Audit Status
              </span>
              <span className="font-bold text-foreground">
                {plant.audits[0]?.status || "Up to Date"}
              </span>
            </div>
          </div>

          {/* Licenses Produced at this Location */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award className="size-4 text-primary" />
              <span>Plant-Specific Licenses & Standards</span>
            </h4>

            <div className="flex flex-col gap-2">
              {plant.licenses.map((lic) => (
                <div
                  key={lic.certificateNumber}
                  className="p-3.5 rounded-xl border border-border/70 bg-background flex flex-col gap-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {lic.certificateNumber}
                      </span>
                      <span className="font-mono text-xs font-semibold text-primary">
                        {lic.standardNumber}
                      </span>
                    </div>
                    <Badge variant={lic.status === "ACTIVE" ? "default" : "secondary"} className="text-2xs">
                      {lic.status}
                    </Badge>
                  </div>

                  <h5 className="font-semibold text-foreground text-xs sm:text-sm">
                    {lic.productName}
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    Scope Models: {lic.modelNumbers.join(", ")}
                  </p>
                  <span className="text-2xs text-muted-foreground font-mono">
                    Valid Until: {new Date(lic.validUntil).toLocaleDateString("en-IN")} ({lic.daysToExpiry} days)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Plant Contact Person */}
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs flex items-start gap-3">
            <User className="size-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground block">
                {plant.contactPerson.name} ({plant.contactPerson.designation})
              </span>
              <span className="text-muted-foreground block">
                Email: {plant.contactPerson.email} · Phone: {plant.contactPerson.phone}
              </span>
            </div>
          </div>

          {/* Factory Audits History at Location */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ClipboardCheck className="size-4 text-blue-600" />
              <span>{t("locations:dialog.auditHistory")}</span>
            </h4>

            {plant.audits.map((aud) => (
              <div
                key={aud.auditNumber}
                className="p-3 rounded-lg border border-border/60 bg-card flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-foreground mr-2">{aud.auditNumber}</span>
                  <span className="text-muted-foreground">{aud.auditType.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-muted-foreground">
                    {new Date(aud.scheduledDate).toLocaleDateString("en-IN")}
                  </span>
                  <Badge variant={aud.status === "SCHEDULED" ? "destructive" : "default"} className="text-2xs">
                    {aud.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dialog Actions & Deep Links */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          <div className="flex flex-wrap items-center gap-2 justify-end w-full sm:w-auto">
            {!isActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onSetActive(plant.id);
                  onOpenChange(false);
                }}
                className="text-xs font-semibold"
              >
                Set as Active Scope
              </Button>
            )}

            <Link to="/factory-audits">
              <Button variant="outline" size="sm" className="gap-1 text-xs font-semibold">
                <ClipboardCheck className="size-3.5 text-blue-600" />
                <span>Audits</span>
              </Button>
            </Link>

            <Link to="/calendar">
              <Button size="sm" className="gap-1 text-xs font-semibold">
                <Calendar className="size-3.5" />
                <span>Calendar</span>
              </Button>
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
