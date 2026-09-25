import { useState } from "react";
import { useTranslation } from "react-i18next";
import { QrCode, Copy, Check, ExternalLink, ShieldCheck, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { BISCertificate } from "@/lib/certificates-api";

interface CertificateQrDialogProps {
  certificate: BISCertificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CertificateQrDialog({
  certificate,
  open,
  onOpenChange,
}: CertificateQrDialogProps) {
  const { t } = useTranslation("certificates");
  const [copied, setCopied] = useState(false);

  if (!certificate) return null;

  const publicVerificationUrl =
    certificate.publicVerificationUrl ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/verify/certificate?number=${encodeURIComponent(certificate.certificateNumber)}`
      : `https://saathi.bis.gov.in/verify/certificate?number=${encodeURIComponent(certificate.certificateNumber)}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicVerificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `BIS Certificate ${certificate.certificateNumber}`,
          text: `Verify official BIS Certificate ${certificate.certificateNumber} for ${certificate.productName}`,
          url: publicVerificationUrl,
        });
      } catch {
        // User cancelled share or unsupported
      }
    } else {
      handleCopy();
    }
  };

  // Official QR Code image URL via secure QR generator service encoded strictly with public URL
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    publicVerificationUrl
  )}&margin=10`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/50 bg-card/95 backdrop-blur-2xl text-center">
        <DialogHeader className="space-y-2 border-b border-border/60 pb-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <QrCode className="size-6" />
          </div>
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
            {t("qr.dialogTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t("qr.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          {/* QR Code Container */}
          <div className="relative flex size-52 items-center justify-center rounded-2xl border-2 border-primary/20 bg-white p-3 shadow-lg">
            <img
              src={qrImageUrl}
              alt={`QR code for ${certificate.certificateNumber}`}
              className="size-full object-contain"
              loading="lazy"
            />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-primary">
              {certificate.certificateNumber}
            </span>
            <p className="text-xs text-muted-foreground">
              {certificate.productName} ({certificate.standardNumber})
            </p>
          </div>

          <div className="w-full rounded-xl border border-border/70 bg-background/50 p-3 text-left space-y-1">
            <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("qr.payloadUrl")}
            </span>
            <p className="font-mono text-2xs text-foreground/80 break-all select-all">
              {publicVerificationUrl}
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-border/60 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 text-xs"
          >
            <Share2 className="size-3.5" />
            Share
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5 text-xs"
            >
              {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              {copied ? t("details.copied") : t("qr.copyUrl")}
            </Button>
            <a
              href={publicVerificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 items-center justify-center gap-1 rounded-[min(var(--radius-md),12px)] bg-primary px-2.5 text-[0.8rem] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <ExternalLink className="size-3.5" />
              {t("qr.openUrl")}
            </a>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
