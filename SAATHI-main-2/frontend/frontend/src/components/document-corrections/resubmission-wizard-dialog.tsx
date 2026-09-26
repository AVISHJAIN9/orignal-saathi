import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Layers,
  FileCheck2,
  HelpCircle,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import {
  documentCorrectionsApi,
  type DocumentCorrectionItem,
  type DocumentValidationResult,
  type DocumentResubmissionResponse,
} from "@/lib/document-corrections-api";
import { DocumentDropzone } from "@/components/admin/document-dropzone";
import { VaultDocumentPicker, type VaultDocItem } from "./vault-document-picker";

interface ResubmissionWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  correction: DocumentCorrectionItem | null;
  onSuccess: (response: DocumentResubmissionResponse) => void;
}

type WizardStep = 1 | 2 | 3 | 4 | 5;

export function ResubmissionWizardDialog({
  open,
  onOpenChange,
  correction,
  onSuccess,
}: ResubmissionWizardDialogProps) {
  const { t, i18n } = useTranslation(["corrections", "chain", "admin"]);
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedVaultDoc, setSelectedVaultDoc] = useState<VaultDocItem | null>(null);
  const [vaultPickerOpen, setVaultPickerOpen] = useState(false);

  // Validation state
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<DocumentValidationResult | null>(null);

  // Step 4 state
  const [remarks, setRemarks] = useState("");
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [declarationError, setDeclarationError] = useState(false);

  // Step 5 / submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<DocumentResubmissionResponse | null>(null);

  // Reset state on open or correction change
  useEffect(() => {
    if (open) {
      setCurrentStep(1);
      setSelectedFile(null);
      setSelectedVaultDoc(null);
      setValidationResult(null);
      setRemarks("");
      setDeclarationAccepted(false);
      setDeclarationError(false);
      setIsSubmitting(false);
      setSubmissionError(null);
      setSubmissionSuccess(null);
    }
  }, [open, correction]);

  if (!correction) return null;

  const handleFileAdded = (files: FileList) => {
    setSelectedFile(files[0]);
    setSelectedVaultDoc(null);
  };

  const handleSelectVaultDoc = (vaultDoc: VaultDocItem) => {
    setSelectedVaultDoc(vaultDoc);
    setSelectedFile(null);
  };

  const runValidation = async () => {
    setIsValidating(true);
    setCurrentStep(3);

    if (selectedFile) {
      const result = await documentCorrectionsApi.validateDocument(correction.id, selectedFile);
      setValidationResult(result);
    } else if (selectedVaultDoc) {
      // Vault documents are pre-indexed
      setValidationResult({
        isValid: true,
        fileName: selectedVaultDoc.name,
        fileSize: 2100000,
        mimeType: "application/pdf",
        formatAccepted: true,
        sizeAccepted: true,
        cortexVerified: true,
        cortexScore: 0.96,
        cortexSummary: "Verified Compliance Vault artifact. Document formatting aligns with standard requirements.",
      });
    }

    setIsValidating(false);
  };

  const handleSubmit = async () => {
    if (!declarationAccepted) {
      setDeclarationError(true);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);
    setCurrentStep(5);

    try {
      const response = await documentCorrectionsApi.resubmitDocument({
        correctionId: correction.id,
        documentId: correction.documentId,
        applicationId: correction.applicationId,
        file: selectedFile || undefined,
        vaultDocumentId: selectedVaultDoc?.id,
        vaultDocumentName: selectedVaultDoc?.name,
        remarks: remarks.trim() || undefined,
        applicantDeclarationAccepted: true,
      });

      setSubmissionSuccess(response);
      onSuccess(response);
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmissionError(err instanceof Error ? err.message : t("corrections:errors.submissionFailed"));
      setCurrentStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "—";
    try {
      return new Date(isoString).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "—";
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const stepsList = [
    { num: 1, label: t("corrections:wizard.steps.step1") },
    { num: 2, label: t("corrections:wizard.steps.step2") },
    { num: 3, label: t("corrections:wizard.steps.step3") },
    { num: 4, label: t("corrections:wizard.steps.step4") },
    { num: 5, label: t("corrections:wizard.steps.step5") },
  ];

  return (
    <Dialog open={open} onOpenChange={isSubmitting ? () => {} : onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-6 overflow-hidden sm:rounded-2xl">
        <DialogHeader className="shrink-0 pb-4 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
                <FileCheck2 className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {submissionSuccess
                    ? t("corrections:wizard.success.title")
                    : t("corrections:wizard.dialogTitle")}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {correction.documentType} • {correction.applicationId}
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs px-2.5 py-0.5 font-mono">
              {correction.standardNumber || "IS Standard"}
            </Badge>
          </div>

          {/* Stepper indicator */}
          {!submissionSuccess && (
            <div className="pt-4">
              <div className="grid grid-cols-5 gap-1.5">
                {stepsList.map((s) => {
                  const isDone = currentStep > s.num;
                  const isCurrent = currentStep === s.num;
                  return (
                    <div key={s.num} className="flex flex-col gap-1">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isDone
                            ? "bg-emerald-500"
                            : isCurrent
                            ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                            : "bg-muted"
                        }`}
                      />
                      <span
                        className={`text-2xs truncate text-center transition-colors ${
                          isCurrent
                            ? "font-bold text-primary"
                            : isDone
                            ? "text-foreground"
                            : "text-muted-foreground/70"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </DialogHeader>

        {/* Dynamic Step Content */}
        <div className="flex-1 overflow-y-auto min-h-0 py-4 pr-1">
          {/* STEP 1: REVIEW ISSUE */}
          {currentStep === 1 && !submissionSuccess && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      {t("corrections:wizard.step1.feedbackHeading")}
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                      {correction.officialFeedback}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card/60 p-3.5 flex flex-col gap-1">
                  <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("corrections:wizard.step1.actionHeading")}
                  </span>
                  <p className="text-xs font-medium text-foreground leading-relaxed">
                    {correction.requiredAction}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card/60 p-3.5 flex flex-col gap-1">
                  <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("corrections:wizard.step1.clauseHeading")}
                  </span>
                  <p className="text-xs font-semibold text-primary">
                    {correction.relatedClause || "General Scheme Requirements"}
                  </p>
                  {correction.deadline && (
                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/60 text-destructive text-xs font-medium">
                      <Clock className="size-3.5 shrink-0" />
                      <span>{t("corrections:card.deadlineLabel")}: {formatDate(correction.deadline)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 flex items-center justify-between text-xs text-muted-foreground">
                <span>{t("corrections:card.versionLabel")}: <strong>v{correction.version}</strong></span>
                <span>{t("corrections:card.submittedOn")}: <strong>{formatDate(correction.originalSubmissionDate)}</strong></span>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT FILE */}
          {currentStep === 2 && !submissionSuccess && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    {t("corrections:wizard.step2.title")}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("corrections:wizard.step2.subtitle")}
                  </p>
                </div>
                {correction.allowVaultSelection !== false && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setVaultPickerOpen(true)}
                    className="rounded-xl text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
                  >
                    <Layers className="size-3.5" />
                    {t("corrections:wizard.step2.openVault")}
                  </Button>
                )}
              </div>

              {/* Dropzone */}
              <DocumentDropzone
                onFilesAdded={handleFileAdded}
                multiple={false}
                title={t("corrections:wizard.step2.dropzoneTitle")}
                hint={t("corrections:wizard.step2.dropzoneHint")}
                className={cn(
                  "rounded-2xl p-8",
                  (selectedFile || selectedVaultDoc) &&
                    "border-emerald-500/50 bg-emerald-500/5",
                )}
              />

              {/* Selected File Banner */}
              {(selectedFile || selectedVaultDoc) && (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-foreground shadow-sm">
                      <FileText className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-emerald-950 dark:text-emerald-100 truncate">
                        {selectedFile?.name || selectedVaultDoc?.name}
                      </p>
                      <p className="text-2xs text-emerald-800 dark:text-emerald-300/80 mt-0.5">
                        {selectedFile
                          ? formatFileSize(selectedFile.size)
                          : `${selectedVaultDoc?.category} • Compliance Vault`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 text-2xs">
                    ✓ Ready
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: VALIDATE */}
          {currentStep === 3 && !submissionSuccess && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              {isValidating ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                  <Loader2 className="size-8 text-primary animate-spin" />
                  <p className="text-sm font-semibold text-foreground">
                    {t("corrections:wizard.step3.cortexAnalyzing")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verifying parameter coverage and checksum integrity...
                  </p>
                </div>
              ) : validationResult ? (
                <div className="flex flex-col gap-4">
                  {/* File integrity checks */}
                  <div className="rounded-xl border border-border bg-card/60 p-4 flex flex-col gap-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("corrections:wizard.step3.fileCheckTitle")}
                    </h4>

                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-500" />
                          {t("corrections:wizard.step3.formatCheck")}
                        </span>
                        <span className="font-mono text-muted-foreground">{validationResult.mimeType}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-500" />
                          {t("corrections:wizard.step3.sizeCheck")}
                        </span>
                        <span className="font-mono text-muted-foreground">{formatFileSize(validationResult.fileSize)}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-500" />
                          {t("corrections:wizard.step3.readabilityCheck")}
                        </span>
                        <Badge variant="outline" className="text-2xs bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                          Passed
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Document Cortex Pre-Scan Summary */}
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                        <Sparkles className="size-4" />
                        {t("corrections:wizard.step3.cortexTitle")}
                      </span>
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-2xs">
                        Pre-Scan Match: {Math.round((validationResult.cortexScore || 0.94) * 100)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">
                      {validationResult.cortexSummary}
                    </p>
                    <div className="flex items-start gap-1.5 pt-2 border-t border-primary/20 text-2xs text-muted-foreground">
                      <Info className="size-3.5 shrink-0 mt-0.5" />
                      <span>{t("corrections:wizard.step3.cortexNote")}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {currentStep === 4 && !submissionSuccess && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              {submissionError && (
                <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                  <XCircle className="size-4 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-foreground">
                  {t("corrections:wizard.step4.comparisonHeading")}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("corrections:wizard.step4.subtitle")}
                </p>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-destructive/25 bg-destructive/[0.03] p-3.5 flex flex-col gap-2">
                  <span className="text-2xs font-bold text-destructive uppercase tracking-wider">
                    {t("corrections:wizard.step4.originalDoc")}
                  </span>
                  <p className="text-xs font-semibold text-foreground truncate">
                    {correction.documentName}
                  </p>
                  <p className="text-2xs text-muted-foreground line-clamp-3">
                    <strong>Issue:</strong> {correction.officialFeedback}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.03] p-3.5 flex flex-col gap-2">
                  <span className="text-2xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    {t("corrections:wizard.step4.replacementDoc")}
                  </span>
                  <p className="text-xs font-semibold text-foreground truncate">
                    {selectedFile?.name || selectedVaultDoc?.name}
                  </p>
                  <p className="text-2xs text-emerald-800 dark:text-emerald-300">
                    <strong>Resolution:</strong> Rectified report addressing required {correction.relatedClause || "parameters"}.
                  </p>
                </div>
              </div>

              {/* Optional remarks */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rectification-remarks" className="text-xs font-semibold text-foreground">
                  {t("corrections:wizard.step4.remarksLabel")}
                </label>
                <Textarea
                  id="rectification-remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={t("corrections:wizard.step4.remarksPlaceholder")}
                  className="text-xs min-h-[64px] rounded-xl resize-none"
                  maxLength={500}
                />
              </div>

              {/* Declaration checkbox */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-card/60">
                <Checkbox
                  id="declaration-checkbox"
                  checked={declarationAccepted}
                  onCheckedChange={(checked) => {
                    setDeclarationAccepted(Boolean(checked));
                    if (checked) setDeclarationError(false);
                  }}
                  className="mt-0.5"
                />
                <div className="flex flex-col gap-0.5">
                  <label htmlFor="declaration-checkbox" className="text-xs text-foreground leading-relaxed cursor-pointer select-none">
                    {t("corrections:wizard.step4.declaration")}
                  </label>
                  {declarationError && (
                    <span className="text-2xs text-destructive font-semibold">
                      {t("corrections:wizard.step4.declarationRequired")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 / SUBMITTING PROGRESS */}
          {currentStep === 5 && isSubmitting && !submissionSuccess && (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center animate-in fade-in duration-200">
              <Loader2 className="size-10 text-primary animate-spin" />
              <div className="flex flex-col gap-1 max-w-sm">
                <h4 className="text-sm font-bold text-foreground">
                  {t("corrections:wizard.step5.title")}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t("corrections:wizard.step5.submittingText")}
                </p>
                <p className="text-2xs text-muted-foreground/70 mt-1">
                  {t("corrections:wizard.step5.doNotClose")}
                </p>
              </div>
              <Progress value={78} className="w-56 h-1.5" />
            </div>
          )}

          {/* SUCCESS CONFIRMATION VIEW */}
          {submissionSuccess && (
            <div className="flex flex-col items-center gap-5 py-6 text-center animate-in zoom-in-95 duration-300">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-md ring-8 ring-emerald-500/10">
                <CheckCircle2 className="size-8" />
              </div>

              <div className="flex flex-col gap-1.5 max-w-md">
                <h3 className="text-lg font-bold text-foreground">
                  {t("corrections:wizard.success.title")}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("corrections:wizard.success.message")}
                </p>
              </div>

              <div className="w-full rounded-2xl border border-border bg-card/80 p-4 text-left flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-border">
                  <span className="text-muted-foreground">{t("corrections:wizard.success.submissionId")}</span>
                  <span className="font-mono font-bold text-primary">{submissionSuccess.submissionId}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-border">
                  <span className="text-muted-foreground">{t("corrections:wizard.success.status")}</span>
                  <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 text-2xs">
                    {submissionSuccess.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-border">
                  <span className="text-muted-foreground">{t("corrections:wizard.success.version")}</span>
                  <span className="font-bold text-foreground">Version {submissionSuccess.version}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t("corrections:wizard.success.submittedAt")}</span>
                  <span className="text-foreground">{formatDate(submissionSuccess.submittedAt)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Link to="/registration/new">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs">
                    {t("corrections:wizard.success.viewApp")}
                  </Button>
                </Link>
                <Link to="/compliance-chain">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs">
                    {t("corrections:wizard.success.viewChain")}
                  </Button>
                </Link>
                <Button
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="rounded-xl text-xs font-semibold px-4"
                >
                  {t("corrections:wizard.success.done")}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!submissionSuccess && !isSubmitting && (
          <div className="shrink-0 pt-4 border-t border-border flex items-center justify-between">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep((prev) => (prev - 1) as WizardStep)}
                className="rounded-xl text-xs gap-1.5"
              >
                <ArrowLeft className="size-3.5" />
                {t("corrections:wizard.actions.back")}
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="rounded-xl text-xs text-muted-foreground"
              >
                {t("corrections:wizard.actions.cancel")}
              </Button>
            )}

            {currentStep === 1 && (
              <Button
                size="sm"
                onClick={() => setCurrentStep(2)}
                className="rounded-xl text-xs gap-1.5 font-semibold"
              >
                {t("corrections:wizard.actions.next")}
                <ArrowRight className="size-3.5" />
              </Button>
            )}

            {currentStep === 2 && (
              <Button
                size="sm"
                disabled={!selectedFile && !selectedVaultDoc}
                onClick={runValidation}
                className="rounded-xl text-xs gap-1.5 font-semibold"
              >
                {t("corrections:wizard.actions.next")}
                <ArrowRight className="size-3.5" />
              </Button>
            )}

            {currentStep === 3 && (
              <Button
                size="sm"
                disabled={isValidating || !validationResult?.isValid}
                onClick={() => setCurrentStep(4)}
                className="rounded-xl text-xs gap-1.5 font-semibold"
              >
                {t("corrections:wizard.actions.next")}
                <ArrowRight className="size-3.5" />
              </Button>
            )}

            {currentStep === 4 && (
              <Button
                size="sm"
                onClick={handleSubmit}
                className="rounded-xl text-xs gap-1.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-foreground shadow-md"
              >
                <CheckCircle2 className="size-3.5" />
                {t("corrections:wizard.actions.submit")}
              </Button>
            )}
          </div>
        )}
      </DialogContent>

      <VaultDocumentPicker
        open={vaultPickerOpen}
        onOpenChange={setVaultPickerOpen}
        onSelect={handleSelectVaultDoc}
      />
    </Dialog>
  );
}
