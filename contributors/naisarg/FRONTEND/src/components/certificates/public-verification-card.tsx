import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Building,
  Calendar,
  Layers,
  Award,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CertificateStatusBadge } from "./certificate-status-badge";
import type { PublicVerificationResult } from "@/lib/certificates-api";

interface PublicVerificationCardProps {
  result: PublicVerificationResult | null;
  isLoading: boolean;
  onRetry?: () => void;
}

export function PublicVerificationCard({
  result,
  isLoading,
  onRetry,
}: PublicVerificationCardProps) {
  const { t } = useTranslation("certificates");
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-card/90 shadow-md backdrop-blur-xl">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-spin">
            <RefreshCw className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              {t("publicVerification.verifying")}
            </h3>
            <p className="text-xs text-muted-foreground">
              Connecting securely to the Bureau of Indian Standards National Central Registry...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const handleCopyLink = () => {
    const url =
      result.publicVerificationUrl ||
      `${window.location.origin}/verify/certificate?number=${encodeURIComponent(result.certificateNumber)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url =
      result.publicVerificationUrl ||
      `${window.location.origin}/verify/certificate?number=${encodeURIComponent(result.certificateNumber)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `BIS Verification: ${result.certificateNumber}`,
          text: `Verified BIS Certificate ${result.certificateNumber} for ${result.productName || "Product"}`,
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  // Case 1: Verification Service Unavailable
  if (result.unverifiedReason === "SERVICE_UNAVAILABLE") {
    return (
      <Card className="border-destructive/30 bg-destructive/5 shadow-md backdrop-blur-xl">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">
              {t("publicVerification.serviceUnavailableHeading")}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              {t("publicVerification.serviceUnavailableNotice")}
            </p>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              className="gap-2 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              <RefreshCw className="size-4" />
              {t("publicVerification.retry")}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Case 2: Certificate Not Verified (Not Found / Invalid Format)
  if (!result.verified) {
    return (
      <Card className="border-amber-500/30 bg-amber-500/5 shadow-md backdrop-blur-xl">
        <CardContent className="p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                {t("publicVerification.unverifiedHeading")}
              </h3>
              <p className="font-mono text-xs font-semibold text-primary">
                {result.certificateNumber || "Unknown"}
              </p>
              <p className="text-xs text-muted-foreground">
                {result.unverifiedMessage || t("publicVerification.unverifiedNotice")}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-background/50 p-4 space-y-2 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">
              {t("publicVerification.possibleReasons")}
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Certificate number might be mistyped or formatting differs (e.g. try CM/L-XXXXXXX).</li>
              <li>Certificate record has not yet synchronized to the public verification replica.</li>
              <li>Verification service is undergoing scheduled directory maintenance.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Case 3: Successfully Verified Certificate
  const formattedIssueDate = result.issueDate
    ? new Date(result.issueDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const formattedValidUntil = result.validUntil
    ? new Date(result.validUntil).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <Card className="border-emerald-500/30 bg-card/95 shadow-lg backdrop-blur-2xl overflow-hidden">
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="size-4 shrink-0" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            {t("publicVerification.verifiedHeading")}
          </span>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-2xs">
          {t("publicVerification.verifiedBadge")}
        </Badge>
      </div>

      <CardContent className="p-6 space-y-5">
        {/* Certificate Number & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("card.certNo")}
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {result.certificateNumber}
            </h2>
          </div>
          {result.status && <CertificateStatusBadge status={result.status} className="text-sm px-3 py-1" />}
        </div>

        {/* Product & Standard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/70 bg-background/50 p-4 space-y-1">
            <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("card.product")}
            </span>
            <p className="text-sm font-bold text-foreground">
              {result.productName}
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/50 p-4 space-y-1">
            <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("card.standard")}
            </span>
            <p className="text-sm font-semibold text-primary">
              {result.standardNumber}
            </p>
            {result.standardTitle && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {result.standardTitle}
              </p>
            )}
          </div>
        </div>

        {/* Certificate Holder & Location */}
        <div className="rounded-xl border border-border/70 bg-background/50 p-4 space-y-2">
          <div className="flex items-start gap-3">
            <Building className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("card.holder")}
              </span>
              <p className="text-sm font-bold text-foreground">
                {result.certificateHolder}
              </p>
              {result.factoryLocation && (
                <p className="text-xs text-muted-foreground">
                  Location: {result.factoryLocation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Validity & Certification Scheme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="size-3.5" />
              <span className="font-mono text-2xs font-semibold uppercase tracking-wider">
                Validity Window
              </span>
            </div>
            <p className="font-medium text-foreground">
              <span className="text-muted-foreground">Grant Date:</span> {formattedIssueDate}
            </p>
            <p className="font-semibold text-foreground">
              <span className="text-muted-foreground">Valid Until:</span> {formattedValidUntil}
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Award className="size-3.5" />
              <span className="font-mono text-2xs font-semibold uppercase tracking-wider">
                {t("card.scheme")}
              </span>
            </div>
            <p className="font-medium text-foreground">
              {result.certificationScheme || "Scheme-I (Conformity Assessment Regulations)"}
            </p>
          </div>
        </div>

        {/* Authoritative Source Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">
              {t("publicVerification.verifiedAgainst")}:
            </span>{" "}
            <span>{result.officialSource}</span>
          </div>
          <span className="font-mono text-2xs text-muted-foreground">
            {new Date(result.verifiedAt).toLocaleString("en-IN")}
          </span>
        </div>

        {/* Action Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border/60">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5 text-xs"
            >
              {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              {copied ? t("details.copied") : t("details.copyLink")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-xs"
            >
              <Share2 className="size-3.5" />
              {t("publicVerification.shareLink")}
            </Button>
          </div>

          {result.documentDownloadUrl && (
            <a
              href={result.documentDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 items-center justify-center gap-1.5 rounded-[min(var(--radius-md),12px)] bg-primary px-3 text-[0.8rem] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Download className="size-3.5" />
              {t("publicVerification.downloadOfficial")}
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
