import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Sparkles,
  Layers,
  FileCheck2,
  Calendar,
  X,
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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  appealsApi,
  type AppealItem,
} from "@/lib/appeals-api";
import { DocumentDropzone } from "@/components/admin/document-dropzone";
import { VaultDocumentPicker, type VaultDocItem } from "@/components/document-corrections/vault-document-picker";

interface AdditionalInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appeal: AppealItem | null;
  onSuccess: () => void;
}

export function AdditionalInfoDialog({
  open,
  onOpenChange,
  appeal,
  onSuccess,
}: AdditionalInfoDialogProps) {
  const { t } = useTranslation(["appeals"]);
  const [responseNotes, setResponseNotes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedVaultDocs, setSelectedVaultDocs] = useState<VaultDocItem[]>([]);
  const [vaultPickerOpen, setVaultPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!appeal) return null;

  const req = appeal.additionalInformationRequest;

  const handleFilesAdded = (files: FileList) => {
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVaultDoc = (index: number) => {
    setSelectedVaultDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!responseNotes.trim() || responseNotes.trim().length < 20) {
      setSubmitError("Please enter a detailed response (at least 20 characters) addressing the officer's request.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const docsPayload = [
        ...selectedFiles.map((f) => ({
          file: f,
          category: "Supplementary Evidence",
        })),
        ...selectedVaultDocs.map((vd) => ({
          vaultDocumentId: vd.id,
          vaultDocumentName: vd.name,
          category: vd.category || "Vault Record",
        })),
      ];

      await appealsApi.submitAdditionalInformation({
        appealId: appeal.id,
        responseNotes,
        documents: docsPayload,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setResponseNotes("");
        setSelectedFiles([]);
        setSelectedVaultDocs([]);
        onOpenChange(false);
        onSuccess();
      }, 1200);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit response.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl border-border/50 bg-background/95 backdrop-blur-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="size-4" />
              </span>
              <DialogTitle className="text-base font-bold sm:text-lg">
                {t("appeals:additionalInfo.title")}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Reference: <span className="font-mono font-semibold text-foreground">{appeal.referenceNumber}</span> ({appeal.productTitle})
            </DialogDescription>
          </DialogHeader>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 mb-3">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground sm:text-base">
                {t("appeals:additionalInfo.successMessage")}
              </h3>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-2">
              {/* Official Observation Alert Box */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs">
                <div className="flex items-center justify-between gap-2 font-semibold text-amber-900 dark:text-amber-200">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                    {t("appeals:additionalInfo.officerRequest")}
                  </span>
                  {req?.deadline && (
                    <Badge variant="outline" className="border-amber-500/40 bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono text-2xs">
                      <Calendar className="size-3 mr-1" />
                      Deadline: {req.deadline}
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-xs text-amber-900/90 dark:text-amber-100/90 leading-relaxed">
                  {req?.description || appeal.reasonSummary}
                </p>
                {req?.requestedFieldsOrDocs && req.requestedFieldsOrDocs.length > 0 && (
                  <div className="mt-3 border-t border-amber-500/20 pt-2">
                    <span className="text-2xs font-semibold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                      Required Documents:
                    </span>
                    <ul className="mt-1 list-inside list-disc text-xs text-amber-950 dark:text-amber-100">
                      {req.requestedFieldsOrDocs.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Response Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {t("appeals:additionalInfo.responseLabel")} <span className="text-destructive">*</span>
                </label>
                <Textarea
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder={t("appeals:additionalInfo.responsePlaceholder")}
                  rows={4}
                  className="resize-none text-xs leading-relaxed"
                />
                <span className="self-end font-mono text-2xs text-muted-foreground">
                  {responseNotes.length} / 2000 chars
                </span>
              </div>

              {/* Evidence attachments */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-foreground">
                  {t("appeals:additionalInfo.attachDocs")}
                </label>

                <DocumentDropzone
                  size="compact"
                  onFilesAdded={handleFilesAdded}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  hint={t("appeals:evidence.dropzoneSub")}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setVaultPickerOpen(true)}
                    className="gap-1.5 text-xs rounded-lg border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/10"
                  >
                    <Layers className="size-3.5" />
                    {t("appeals:actions.selectFromVault")}
                  </Button>
                </div>

                {/* Selected Files & Vault Docs Preview */}
                {(selectedFiles.length > 0 || selectedVaultDocs.length > 0) && (
                  <div className="mt-2 flex flex-col gap-1.5 rounded-lg border border-border bg-muted/40 p-2.5">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={`file-${idx}`}
                        className="flex items-center justify-between gap-2 rounded bg-background p-1.5 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="size-3.5 text-primary shrink-0" />
                          <span className="truncate">{file.name}</span>
                          <span className="font-mono text-2xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 shrink-0"
                          onClick={() => removeFile(idx)}
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    ))}

                    {selectedVaultDocs.map((vdoc, idx) => (
                      <div
                        key={`vdoc-${idx}`}
                        className="flex items-center justify-between gap-2 rounded bg-background p-1.5 text-xs border border-blue-500/20"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Layers className="size-3.5 text-blue-500 shrink-0" />
                          <span className="truncate">{vdoc.name}</span>
                          <Badge variant="secondary" className="text-2xs py-0">
                            Vault
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 shrink-0"
                          onClick={() => removeVaultDoc(idx)}
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {submitError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive flex items-center gap-2">
                  <XCircle className="size-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
            </div>
          )}

          {!isSuccess && (
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="text-xs rounded-lg"
              >
                {t("appeals:actions.cancel")}
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="text-xs rounded-lg gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    {t("appeals:additionalInfo.submitting")}
                  </>
                ) : (
                  <>
                    <FileCheck2 className="size-3.5" />
                    {t("appeals:additionalInfo.submitResponse")}
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <VaultDocumentPicker
        open={vaultPickerOpen}
        onOpenChange={setVaultPickerOpen}
        onSelect={(doc) => {
          setSelectedVaultDocs((prev) => [...prev, doc]);
        }}
      />
    </>
  );
}
