import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Award,
  Download,
  Eye,
  History,
  QrCode,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CertificateStatusBadge } from "./certificate-status-badge";
import { Link } from "@/lib/router-compat";
import type { BISCertificate } from "@/lib/certificates-api";

interface CertificateCardProps {
  certificate: BISCertificate;
  onViewDetails: (certificate: BISCertificate) => void;
  onViewHistory: (certificate: BISCertificate) => void;
  onViewQr: (certificate: BISCertificate) => void;
  onDownload: (certificate: BISCertificate) => void;
}

export function CertificateCard({
  certificate,
  onViewDetails,
  onViewHistory,
  onViewQr,
  onDownload,
}: CertificateCardProps) {
  const { t } = useTranslation("certificates");

  const formattedIssueDate = new Date(certificate.issueDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedValidUntil = new Date(certificate.validUntil).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="group relative overflow-hidden border-border/80 bg-card/90 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md backdrop-blur-xl">
      <CardHeader className="flex flex-row items-start justify-between gap-3 border-b border-border/40 p-4 pb-3">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Award className="size-4 text-primary shrink-0" />
            <span className="font-mono text-xs font-bold text-foreground truncate">
              {certificate.certificateNumber}
            </span>
          </div>
          <p className="text-xs font-semibold text-primary truncate">
            {certificate.productName}
          </p>
        </div>
        <CertificateStatusBadge status={certificate.status} />
      </CardHeader>

      <CardContent className="p-4 space-y-3.5 text-xs">
        {/* Standard Info */}
        <div className="space-y-0.5">
          <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("card.standard")}
          </span>
          <p className="font-medium text-foreground">
            {certificate.standardNumber} — <span className="text-muted-foreground">{certificate.standardTitle}</span>
          </p>
        </div>

        {/* Certificate Holder */}
        <div className="space-y-0.5">
          <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("card.holder")}
          </span>
          <p className="font-medium text-foreground truncate">
            {certificate.certificateHolder}
          </p>
        </div>

        {/* Validity Grid */}
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-border/60 bg-background/50 p-2.5">
          <div>
            <span className="font-mono text-2xs text-muted-foreground uppercase">
              {t("card.issued")}
            </span>
            <p className="font-medium text-foreground">{formattedIssueDate}</p>
          </div>
          <div>
            <span className="font-mono text-2xs text-muted-foreground uppercase">
              {t("card.validUntil")}
            </span>
            <p className="font-semibold text-foreground">{formattedValidUntil}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="xs"
              onClick={() => onViewDetails(certificate)}
              className="gap-1 text-xs"
            >
              <Eye className="size-3.5" />
              {t("card.viewDetails")}
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => onDownload(certificate)}
              className="gap-1 text-xs"
            >
              <Download className="size-3.5" />
              {t("card.downloadPdf")}
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => onViewHistory(certificate)}
              title={t("card.history")}
            >
              <History className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-primary"
              onClick={() => onViewQr(certificate)}
              title={t("card.qrCode")}
            >
              <QrCode className="size-3.5" />
            </Button>
            <Link
              to={`/verify/certificate?number=${encodeURIComponent(certificate.certificateNumber)}`}
              className="inline-flex size-7 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              title={t("card.verifyOnline")}
            >
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
