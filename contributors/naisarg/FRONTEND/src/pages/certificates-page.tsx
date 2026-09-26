import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Award,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  FileCheck2,
  ShieldCheck,
  Clock,
  AlertTriangle,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { AmbientBackground } from "@/components/ambient-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/lib/router-compat";
import { CertificateCard } from "@/components/certificates/certificate-card";
import { CertificateDetailsDialog } from "@/components/certificates/certificate-details-dialog";
import { CertificateHistoryDialog } from "@/components/certificates/certificate-history-dialog";
import { CertificateQrDialog } from "@/components/certificates/certificate-qr-dialog";
import {
  certificatesApi,
  type BISCertificate,
  type CertificateSummary,
  type CertificateStatus,
} from "@/lib/certificates-api";
import { useRole } from "@/lib/role";
import { PlaceholderPage } from "@/components/placeholder-page";

export function CertificatesPage() {
  const { t } = useTranslation(["certificates", "admin"]);
  const { role, ready } = useRole();

  const [certificates, setCertificates] = useState<BISCertificate[]>([]);
  const [summary, setSummary] = useState<CertificateSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Dialog state
  const [selectedCert, setSelectedCert] = useState<BISCertificate | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const fetchCertificates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await certificatesApi.getCertificates({
        status: statusFilter,
        search: searchQuery,
      });
      setCertificates(data.certificates);
      setSummary(data.summary);
    } catch (err) {
      console.error("Failed to load certificates:", err);
      setError(err instanceof Error ? err.message : t("certificates:errorState.description"));
      setCertificates([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, t]);

  useEffect(() => {
    void fetchCertificates();
  }, [fetchCertificates]);

  const handleDownload = async (cert: BISCertificate) => {
    try {
      const result = await certificatesApi.downloadCertificate(cert.id);
      // Simulate/trigger download
      const link = document.createElement("a");
      link.href = result.downloadUrl;
      link.download = result.fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      alert(err instanceof Error ? err.message : "Failed to download official certificate document.");
    }
  };

  const handleOpenDetails = (cert: BISCertificate) => {
    setSelectedCert(cert);
    setDetailsOpen(true);
  };

  const handleOpenHistory = (cert: BISCertificate) => {
    setSelectedCert(cert);
    setHistoryOpen(true);
  };

  const handleOpenQr = (cert: BISCertificate) => {
    setSelectedCert(cert);
    setQrOpen(true);
  };

  if (!ready) return null;

  if (role !== "industry" && role !== "admin") {
    return <PlaceholderPage title={t("certificates:heading")} allowed={false} />;
  }

  return (
    <div className="relative min-h-dvh bg-background pb-16">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
        {/* Top bar header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold tracking-wide text-primary uppercase">
              {t("certificates:eyebrow")}
            </span>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {t("certificates:heading")}
            </h1>
            <p className="max-w-xl text-xs text-muted-foreground sm:text-sm">
              {t("certificates:subheading")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/verify/certificate"
              className="inline-flex h-7 items-center justify-center gap-1.5 rounded-[min(var(--radius-md),12px)] border border-primary/30 bg-background px-2.5 text-[0.8rem] font-medium text-primary shadow-sm transition-colors hover:bg-muted"
            >
              <ExternalLink className="size-3.5" />
              {t("certificates:publicVerification.verifyBtn")}
            </Link>
          </div>
        </div>

        {/* Summary Stats Cards */}
        {summary && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border/80 bg-card/80 p-3.5 backdrop-blur-xl shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="size-4 text-primary" />
                <span className="font-mono text-2xs font-semibold uppercase tracking-wider">
                  {t("certificates:stats.total")}
                </span>
              </div>
              <p className="mt-1 font-mono text-2xl font-bold text-foreground">
                {summary.totalCount}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 backdrop-blur-xl shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="size-4" />
                <span className="font-mono text-2xs font-semibold uppercase tracking-wider">
                  {t("certificates:stats.active")}
                </span>
              </div>
              <p className="mt-1 font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {summary.activeCount}
              </p>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 backdrop-blur-xl shadow-sm">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Clock className="size-4" />
                <span className="font-mono text-2xs font-semibold uppercase tracking-wider">
                  {t("certificates:stats.expiringSoon")}
                </span>
              </div>
              <p className="mt-1 font-mono text-2xl font-bold text-amber-700 dark:text-amber-400">
                {summary.expiringCount}
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card/80 p-3.5 backdrop-blur-xl shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertTriangle className="size-4 text-orange-500" />
                <span className="font-mono text-2xs font-semibold uppercase tracking-wider">
                  {t("certificates:stats.suspended")}
                </span>
              </div>
              <p className="mt-1 font-mono text-2xl font-bold text-foreground">
                {summary.suspendedCount}
              </p>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/80 bg-card/80 p-3.5 backdrop-blur-xl shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("certificates:searchPlaceholder")}
              className="pl-9 bg-background/60"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-background/60 text-xs">
                <SelectValue placeholder={t("certificates:filterAll")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("certificates:filterAll")}</SelectItem>
                <SelectItem value="ACTIVE">{t("certificates:filterActive")}</SelectItem>
                <SelectItem value="EXPIRED">{t("certificates:filterExpired")}</SelectItem>
                <SelectItem value="SUSPENDED">{t("certificates:filterSuspended")}</SelectItem>
                <SelectItem value="UNDER_RENEWAL">{t("certificates:filterRenewal")}</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={fetchCertificates}
              title="Refresh"
              className="shrink-0 size-9"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Certificate Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-56 w-full rounded-2xl" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center backdrop-blur-xl sm:p-12">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
              <AlertCircle className="size-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {t("certificates:errorState.title")}
            </h3>
            <p className="mt-2 max-w-md text-xs text-muted-foreground sm:text-sm">
              {error}
            </p>
            <Button onClick={fetchCertificates} className="mt-6 gap-2 rounded-xl">
              <RefreshCw className="size-4" />
              {t("certificates:errorState.retry")}
            </Button>
          </div>
        ) : certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/60 p-12 text-center backdrop-blur-xl">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
              <Award className="size-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {t("certificates:emptyState.title")}
            </h3>
            <p className="mt-2 max-w-md text-xs text-muted-foreground">
              {t("certificates:emptyState.description")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {certificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onViewDetails={handleOpenDetails}
                onViewHistory={handleOpenHistory}
                onViewQr={handleOpenQr}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialog Modals */}
      <CertificateDetailsDialog
        certificate={selectedCert}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDownload={handleDownload}
      />

      <CertificateHistoryDialog
        certificate={selectedCert}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />

      <CertificateQrDialog
        certificate={selectedCert}
        open={qrOpen}
        onOpenChange={setQrOpen}
      />
    </div>
  );
}
