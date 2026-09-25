import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Gavel,
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
  AlertTriangle,
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  appealsApi,
  type DecisionContext,
  type IssueCategory,
  type ResolutionType,
  type AppealSubmissionResponse,
} from "@/lib/appeals-api";
import { DocumentDropzone } from "@/components/admin/document-dropzone";
import { VaultDocumentPicker, type VaultDocItem } from "@/components/document-corrections/vault-document-picker";
import { cn } from "@/lib/utils";

interface AppealWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  decisionContext: DecisionContext | null;
  onSuccess: (response: AppealSubmissionResponse) => void;
  defaultResolutionType?: ResolutionType;
}

type WizardStep = 1 | 2 | 3 | 4 | 5;

export function AppealWizardDialog({
  open,
  onOpenChange,
  decisionContext,
  onSuccess,
  defaultResolutionType,
}: AppealWizardDialogProps) {
  const { t } = useTranslation(["appeals"]);
  const [step, setStep] = useState<WizardStep>(1);

  // Form states
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory>("TESTING_DEFICIENCY");
  const [selectedResolutionType, setSelectedResolutionType] = useState<ResolutionType>(
    defaultResolutionType || "REVIEW_REQUEST"
  );
  const [reasonSummary, setReasonSummary] = useState("");
  const [detailedExplanation, setDetailedExplanation] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedVaultDocs, setSelectedVaultDocs] = useState<VaultDocItem[]>([]);
  const [vaultPickerOpen, setVaultPickerOpen] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // Submission & error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<AppealSubmissionResponse | null>(null);


  useEffect(() => {
    if (open) {
      setStep(1);
      if (defaultResolutionType) {
        setSelectedResolutionType(defaultResolutionType);
      } else if (decisionContext?.supportedResolutionTypes?.[0]) {
        setSelectedResolutionType(decisionContext.supportedResolutionTypes[0]);
      }
      setReasonSummary("");
      setDetailedExplanation("");
      setSelectedFiles([]);
      setSelectedVaultDocs([]);
      setDeclarationAccepted(false);
      setIsSubmitting(false);
      setSubmissionError(null);
      setSubmissionResult(null);
    }
  }, [open, decisionContext, defaultResolutionType]);

  if (!decisionContext) return null;

  const supportedTypes: ResolutionType[] =
    decisionContext.supportedResolutionTypes || [
      "APPEAL",
      "REVIEW_REQUEST",
      "CLARIFICATION_REQUEST",
      "ASSESSMENT_RESPONSE",
    ];

  const categories: { key: IssueCategory; labelKey: string }[] = [
    { key: "TESTING_DEFICIENCY", labelKey: "TESTING_DEFICIENCY" },
    { key: "INSPECTION_FINDING", labelKey: "INSPECTION_FINDING" },
    { key: "APPLICATION_DECISION", labelKey: "APPLICATION_DECISION" },
    { key: "CERTIFICATION_DECISION", labelKey: "CERTIFICATION_DECISION" },
    { key: "COMPLIANCE_ASSESSMENT", labelKey: "COMPLIANCE_ASSESSMENT" },
    { key: "OTHER", labelKey: "OTHER" },
  ];

  const handleFilesAdded = (files: FileList) => {
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeVaultDoc = (idx: number) => {
    setSelectedVaultDocs((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateStep2 = () => {
    if (!reasonSummary.trim() || reasonSummary.trim().length < 8) {
      setSubmissionError("Please provide a concise summary of the grounds for dispute (min 8 characters).");
      return false;
    }
    if (!detailedExplanation.trim() || detailedExplanation.trim().length < 30) {
      setSubmissionError("Please provide a detailed technical explanation (min 30 characters).");
      return false;
    }
    setSubmissionError(null);
    return true;
  };

  const handleNext = () => {
    setSubmissionError(null);
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleBack = () => {
    setSubmissionError(null);
    if (step > 1) {
      setStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const handleSubmit = async () => {
    if (!declarationAccepted) {
      setSubmissionError(t("appeals:wizard.declarationRequired"));
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const evidencePayload = [
        ...selectedFiles.map((f) => ({
          file: f,
          category: "Uploaded Evidence",
        })),
        ...selectedVaultDocs.map((vd) => ({
          vaultDocumentId: vd.id,
          vaultDocumentName: vd.name,
          category: vd.category || "Compliance Vault",
        })),
      ];

      const response = await appealsApi.submitAppeal({
        applicationId: decisionContext.applicationId,
        decisionId: decisionContext.id,
        issueCategory: selectedCategory,
        resolutionType: selectedResolutionType,
        reason: reasonSummary,
        detailedExplanation,
        evidence: evidencePayload,
        declarationConfirmed: declarationAccepted,
      });

      setSubmissionResult(response);
      setStep(5);
      onSuccess(response);
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : t("appeals:errors.submitFailedDesc"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (step / 5) * 100;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl border-border/50 bg-background/95 backdrop-blur-2xl">
          <DialogHeader className="border-b border-border/50 pb-3">
            {/* pr-8 keeps the step badge clear of the dialog's absolutely
                positioned close button (top-2 right-2). */}
            <div className="flex items-center justify-between gap-2 pr-8">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Gavel className="size-4" />
                </span>
                <DialogTitle className="text-base font-bold sm:text-lg">
                  {t("appeals:wizard.title")}
                </DialogTitle>
              </div>
              <Badge variant="secondary" className="font-mono text-xs">
                Step {step} of 5
              </Badge>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Application: <span className="font-mono font-medium text-foreground">{decisionContext.applicationId}</span> ({decisionContext.productTitle})
            </DialogDescription>
            <div className="mt-2">
              <Progress value={progressPercentage} className="h-1.5" />
            </div>
          </DialogHeader>

          {/* Step 1: Select Issue & Resolution Path */}
          {step === 1 && (
            <div className="flex flex-col gap-4 py-2">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {t("appeals:wizard.step1Title")}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("appeals:wizard.step1Desc")}
                </p>
              </div>

              {/* Resolution Path Selection */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-semibold text-foreground">
                  {t("appeals:wizard.resolutionPathLabel")}
                </Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {supportedTypes.map((typeKey) => {
                    const isSelected = selectedResolutionType === typeKey;
                    return (
                      <button
                        key={typeKey}
                        type="button"
                        onClick={() => setSelectedResolutionType(typeKey)}
                        className={cn(
                          "flex flex-col items-start p-3 rounded-xl border text-left transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/40"
                            : "border-border bg-card/60 hover:bg-muted/60 text-muted-foreground"
                        )}
                      >
                        <span className={cn("text-xs font-bold", isSelected ? "text-primary" : "text-foreground")}>
                          {t(`appeals:resolutionPaths.${typeKey}.title`)}
                        </span>
                        <span className="text-2xs text-muted-foreground mt-1 leading-snug">
                          {t(`appeals:resolutionPaths.${typeKey}.description`)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Issue Category Selection */}
              <div className="flex flex-col gap-2 mt-2">
                <Label className="text-xs font-semibold text-foreground">
                  {t("appeals:wizard.issueLabel")}
                </Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className={cn(
                        "flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all",
                        selectedCategory === cat.key
                          ? "border-primary bg-primary/5 text-primary font-semibold"
                          : "border-border bg-card/40 hover:bg-muted/40 text-foreground"
                      )}
                    >
                      <span className={cn("size-2 rounded-full", selectedCategory === cat.key ? "bg-primary" : "bg-muted-foreground/40")} />
                      <span className="truncate">{t(`appeals:categories.${cat.labelKey}`)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Reason & Detailed Explanation */}
          {step === 2 && (
            <div className="flex flex-col gap-4 py-2">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {t("appeals:wizard.step2Title")}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("appeals:wizard.step2Desc")}
                </p>
              </div>

              {/* Summary of Grounds */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {t("appeals:wizard.reasonLabel")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={reasonSummary}
                  onChange={(e) => setReasonSummary(e.target.value)}
                  placeholder={t("appeals:wizard.reasonPlaceholder")}
                  className="text-xs"
                />
              </div>

              {/* Detailed Explanation */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {t("appeals:wizard.explanationLabel")} <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  value={detailedExplanation}
                  onChange={(e) => setDetailedExplanation(e.target.value)}
                  placeholder={t("appeals:wizard.explanationPlaceholder")}
                  rows={5}
                  className="resize-none text-xs leading-relaxed"
                />
                <div className="flex items-center justify-between text-2xs text-muted-foreground">
                  <span>{t("appeals:wizard.reasonMinLength")}</span>
                  <span className="font-mono">{detailedExplanation.length} / 2000 chars</span>
                </div>
              </div>

              {/* Neutral regulatory safety callout */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2">
                <HelpCircle className="size-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="leading-snug text-2xs">
                  {t("appeals:wizard.neutralNotice")}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Supporting Evidence */}
          {step === 3 && (
            <div className="flex flex-col gap-4 py-2">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {t("appeals:wizard.step3Title")}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("appeals:wizard.step3Desc")}
                </p>
              </div>

              {/* Upload or Select Actions */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DocumentDropzone
                  onFilesAdded={handleFilesAdded}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  hint={t("appeals:evidence.dropzoneSub")}
                  className="justify-center rounded-xl px-4 py-4"
                />

                <button
                  type="button"
                  onClick={() => setVaultPickerOpen(true)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-colors gap-1.5 text-center"
                >
                  <Layers className="size-6 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-blue-800 dark:text-blue-300">{t("appeals:actions.selectFromVault")}</span>
                  <span className="text-2xs text-muted-foreground">Select existing test reports from Compliance Vault</span>
                </button>
              </div>

              {/* Selected Files & Vault Docs Preview */}
              {(selectedFiles.length > 0 || selectedVaultDocs.length > 0) ? (
                <div className="flex flex-col gap-2 rounded-xl border border-border bg-card/60 p-3">
                  <span className="text-xs font-semibold text-foreground">
                    Attached Documents ({selectedFiles.length + selectedVaultDocs.length})
                  </span>

                  {selectedFiles.map((file, idx) => (
                    <div
                      key={`file-${idx}`}
                      className="flex items-center justify-between gap-2 rounded-lg bg-background p-2 text-xs border border-border/80"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="size-4 text-primary shrink-0" />
                        <span className="truncate font-medium">{file.name}</span>
                        <span className="font-mono text-2xs text-muted-foreground">
                          ({(file.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFile(idx)}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ))}

                  {selectedVaultDocs.map((vdoc, idx) => (
                    <div
                      key={`vdoc-${idx}`}
                      className="flex items-center justify-between gap-2 rounded-lg bg-background p-2 text-xs border border-blue-500/30"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Layers className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="truncate font-medium">{vdoc.name}</span>
                        <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-2xs py-0">
                          Vault
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeVaultDoc(idx)}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  {t("appeals:evidence.empty")}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review & Declaration */}
          {step === 4 && (
            <div className="flex flex-col gap-4 py-2">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {t("appeals:wizard.step4Title")}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("appeals:wizard.step4Desc")}
                </p>
              </div>

              {/* Review Summary Card */}
              <div className="rounded-xl border border-border/50 bg-card/60 p-4 shadow-sm text-xs flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground">Application:</span>
                    <p className="font-semibold text-foreground">{decisionContext.applicationId}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Resolution Path:</span>
                    <p className="font-semibold text-primary">
                      {t(`appeals:resolutionPaths.${selectedResolutionType}.title`)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Issue Category:</span>
                    <p className="font-semibold text-foreground">
                      {t(`appeals:categories.${selectedCategory}`)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Attached Evidence:</span>
                    <p className="font-semibold text-foreground">
                      {selectedFiles.length + selectedVaultDocs.length} documents
                    </p>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-2 flex flex-col gap-1">
                  <span className="text-muted-foreground font-semibold">Summary of Grounds:</span>
                  <p className="text-foreground leading-relaxed">{reasonSummary}</p>
                </div>

                <div className="border-t border-border/50 pt-2 flex flex-col gap-1">
                  <span className="text-muted-foreground font-semibold">Detailed Explanation:</span>
                  <p className="text-foreground leading-relaxed line-clamp-4">{detailedExplanation}</p>
                </div>
              </div>

              {/* Applicant Declaration Checkbox */}
              <div className="flex items-start gap-2.5 rounded-xl border border-primary/25 bg-primary/5 p-3.5">
                <Checkbox
                  id="decl"
                  checked={declarationAccepted}
                  onCheckedChange={(checked) => setDeclarationAccepted(checked === true)}
                  className="mt-0.5"
                />
                <label htmlFor="decl" className="text-xs text-foreground leading-relaxed cursor-pointer select-none">
                  {t("appeals:wizard.declarationText")}
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Submission Success Confirmation */}
          {step === 5 && submissionResult && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 mb-3 shadow-sm">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-base font-bold text-foreground sm:text-lg">
                {t("appeals:wizard.step5Title")}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md">
                {submissionResult.message || t("appeals:wizard.successMessage")}
              </p>

              <div className="mt-5 w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs flex flex-col gap-2.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("appeals:wizard.referenceId")}:</span>
                  <span className="font-mono font-bold text-foreground text-sm">
                    {submissionResult.referenceNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("appeals:wizard.submittedOn")}:</span>
                  <span className="font-mono text-foreground">
                    {new Date(submissionResult.submittedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("appeals:wizard.status")}:</span>
                  <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-semibold text-xs">
                    {t(`appeals:statuses.${submissionResult.status}`, { defaultValue: submissionResult.status })}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {submissionError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive flex items-center gap-2">
              <XCircle className="size-4 shrink-0" />
              <span>{submissionError}</span>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 border-t border-border/50 pt-3">
            {step < 5 ? (
              <div className="flex w-full items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={step === 1 ? () => onOpenChange(false) : handleBack}
                  disabled={isSubmitting}
                  className="text-xs rounded-lg gap-1"
                >
                  <ArrowLeft className="size-3.5" />
                  {step === 1 ? t("appeals:actions.cancel") : t("appeals:actions.back")}
                </Button>

                {step < 4 ? (
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="text-xs rounded-lg gap-1 font-semibold"
                  >
                    {t("appeals:actions.next")}
                    <ArrowRight className="size-3.5" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !declarationAccepted}
                    className="text-xs rounded-lg gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        {t("appeals:actions.submitting")}
                      </>
                    ) : (
                      <>
                        <FileCheck2 className="size-3.5" />
                        {t("appeals:actions.submit")}
                      </>
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => onOpenChange(false)}
                className="w-full text-xs rounded-lg font-semibold"
              >
                {t("appeals:actions.close")}
              </Button>
            )}
          </DialogFooter>
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
