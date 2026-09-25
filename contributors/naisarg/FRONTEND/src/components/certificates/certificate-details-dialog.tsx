import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Download,
  ExternalLink,
  Copy,
  Check,
  Building,
  Calendar,
  ShieldCheck,
  Award,
  Layers,
  MapPin,
  UserCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CertificateStatusBadge } from "./certificate-status-badge";
import type { BISCertificate } from "@/lib/certificates-api";

interface CertificateDetailsDialogProps {
  certificate: BISCertificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (certificate: BISCertificate) => void;
}

export function CertificateDetailsDialog({
  certificate,
  open,
  onOpenChange,
  onDownload,
}: CertificateDetailsDialogProps) {
  const { t } = useTranslation("certificates");
  const [copied, setCopied] = useState(false);

  if (!certificate) return null;

  const handleCopyLink = () => {
    const url =
      certificate.publicVerificationUrl ||
      `${window.location.origin}/verify/certificate?number=${encodeURIComponent(certificate.certificateNumber)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedIssueDate = new Date(certificate.issueDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedValidUntil = new Date(certificate.validUntil).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border/50 bg-card/95 backdrop-blur-2xl sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2 border-b border-border/60 pb-4 text-left">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-primary shrink-0" />
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                {certificate.certificateNumber}
              </DialogTitle>
            </div>
            <CertificateStatusBadge status={certificate.status} />
          </div>
          <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
            {t("details.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-3">
          {/* Main Info Card */}
          <div className="rounded-xl border border-border/70 bg-background/50 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("card.product")}
                </span>
                <p className="text-sm font-bold text-foreground">
                  {certificate.productName}
                  {certificate.brandName && (
                    <span className="ml-2 font-normal text-muted-foreground">
                      (Brand: {certificate.brandName}{certificate.modelNumber ? `, Model: ${certificate.modelNumber}` : ""})
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 border-t border-border/40">
              <div>
                <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("card.standard")}
                </span>
                <p className="text-xs font-semibold text-primary">
                  {certificate.standardNumber}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {certificate.standardTitle}
                </p>
              </div>

              <div>
                <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("card.scheme")}
                </span>
                <p className="text-xs font-medium text-foreground">
                  {certificate.certificationScheme}
                </p>
              </div>
            </div>
          </div>

          {/* Holder & Facility */}
          <div className="rounded-xl border border-border/70 bg-background/50 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Building className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("card.holder")}
                </span>
                <p className="text-xs font-semibold text-foreground">
                  {certificate.certificateHolder}
                </p>
                {certificate.factoryAddress && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                    {certificate.factoryAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Validity & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="size-3.5" />
                <span className="font-mono text-2xs font-semibold uppercase tracking-wider">
                  {t("card.issued")} & {t("card.validUntil")}
                </span>
              </div>
              <p className="text-xs font-medium text-foreground">
                <span className="text-muted-foreground">From:</span> {formattedIssueDate}
              </p>
              <p className="text-xs font-semibold text-foreground">
                <span className="text-muted-foreground">To:</span> {formattedValidUntil}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <UserCheck className="size-3.5" />
                <span className="font-mono text-2xs font-semibold uppercase tracking-wider">
                  {t("details.grantingAuthority")}
                </span>
              </div>
              <p className="text-xs font-medium text-foreground">
                {certificate.grantingBranch || "Central Certification Authority"}
              </p>
              {certificate.officerName && (
                <p className="text-2xs text-muted-foreground">
                  Signatory: {certificate.officerName} ({certificate.officerDesignation})
                </p>
              )}
            </div>
          </div>

          {/* Scope of license if available */}
          {certificate.scopeOfLicense && (
            <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Layers className="size-3.5" />
                <span className="font-mono text-2xs font-semibold uppercase tracking-wider">
                  {t("details.standardAndScope")}
                </span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">
                {certificate.scopeOfLicense}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-border/60 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="gap-1.5 text-xs"
          >
            {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
            {copied ? t("details.copied") : t("details.copyLink")}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              {t("details.close")}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => onDownload(certificate)}
              className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Download className="size-3.5" />
              {t("details.downloadOfficial")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
