import { useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  FileUp,
  ShieldAlert,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  RenewalLicence,
  SurveillanceAuditSubmission,
} from "@/lib/mock-renewals";
import { cn } from "@/lib/utils";

interface SurveillanceAuditStepProps {
  licence: RenewalLicence;
  auditData: SurveillanceAuditSubmission;
  onChange: (updated: SurveillanceAuditSubmission) => void;
  onProceed: () => void;
  onBack: () => void;
}

export function SurveillanceAuditStep({
  licence,
  auditData,
  onChange,
  onProceed,
  onBack,
}: SurveillanceAuditStepProps) {
  const { t } = useTranslation("renewal");

  const [calibFileName, setCalibFileName] = useState<string | null>(
    auditData.calibrationFileName ?? null,
  );
  const [testLogFileName, setTestLogFileName] = useState<string | null>(
    auditData.internalTestLogFileName ?? null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSlotSelect = (slot: "morning" | "afternoon" | "fullday") => {
    onChange({ ...auditData, timeSlot: slot });
  };

  const handleChecklistToggle = (
    key: keyof SurveillanceAuditSubmission["checklist"],
  ) => {
    onChange({
      ...auditData,
      checklist: {
        ...auditData.checklist,
        [key]: !auditData.checklist[key],
      },
    });
  };

  const handleNext = () => {
    if (!auditData.preferredDate) {
      setErrorMsg(t("step3.errors.date"));
      return;
    }
    if (!auditData.qcContactName.trim() || !auditData.qcContactPhone.trim()) {
      setErrorMsg(t("step3.errors.contact"));
      return;
    }
    setErrorMsg(null);
    onProceed();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            {t("step3.title")}
          </h2>
          <Badge className="border-transparent bg-amber-500/20 font-mono text-[0.65rem] font-bold text-amber-800 dark:text-amber-300">
            {t("step3.mandatoryBadge")}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("step3.subtitle")}
        </p>
      </div>

      {/* Reasoning banner — drawn from the licence's real QCO-derived
       * surveillanceReasons, not a fabricated regulation citation. */}
      <div className="elevation-1 flex flex-col gap-3.5 rounded-2xl border-2 border-amber-400 bg-amber-50/90 p-5 dark:border-amber-700/60 dark:bg-amber-950/25">
        <div className="flex items-start gap-3.5">
          <div className="rounded-xl bg-amber-500/25 p-2 text-amber-800 dark:text-amber-300">
            <ShieldAlert className="size-6 shrink-0" aria-hidden />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="font-semibold text-amber-950 dark:text-amber-100">
              {t("step3.alertHeading")}
            </span>
            <ul className="flex flex-col gap-1">
              {licence.surveillanceReasons.map((reason, idx) => (
                <li
                  key={idx}
                  className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90"
                >
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section 1: Inspection Date & Slot Scheduling */}
      <div className="elevation-1 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 border-b border-border/70 pb-3">
          <CalendarDays className="size-4 text-primary" aria-hidden />
          <h3 className="text-sm font-semibold text-foreground">
            {t("step3.schedulingSection")}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pref-date" className="text-xs font-medium">
              {t("step3.preferredDate")} *
            </Label>
            <Input
              id="pref-date"
              type="date"
              value={auditData.preferredDate}
              onChange={(e) =>
                onChange({ ...auditData, preferredDate: e.target.value })
              }
              className="font-mono text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alt-date" className="text-xs font-medium">
              {t("step3.altDate")}
            </Label>
            <Input
              id="alt-date"
              type="date"
              value={auditData.alternativeDate}
              onChange={(e) =>
                onChange({ ...auditData, alternativeDate: e.target.value })
              }
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Label className="text-xs font-medium">{t("step3.timeSlot")}</Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(["morning", "afternoon", "fullday"] as const).map((slot) => {
              const isSelected = auditData.timeSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleSlotSelect(slot)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-xs ring-2 ring-primary/20"
                      : "border-border bg-background hover:bg-muted/50 text-foreground",
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-semibold text-xs">
                      {t(`step3.slotLabels.${slot}`)}
                    </span>
                    <Clock className="size-3.5 opacity-70" />
                  </div>
                  <span className="text-[0.68rem] text-muted-foreground">
                    {t(`step3.slots.${slot}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 2: QC Lead & Inspection Escort Details */}
      <div className="elevation-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 border-b border-border/70 pb-3">
          <UserCheck className="size-4 text-primary" aria-hidden />
          <h3 className="text-sm font-semibold text-foreground">
            {t("step3.qcLeadSection")}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="qc-name" className="text-xs font-medium">
              {t("step3.qcName")} *
            </Label>
            <Input
              id="qc-name"
              value={auditData.qcContactName}
              onChange={(e) =>
                onChange({ ...auditData, qcContactName: e.target.value })
              }
              placeholder={t("step3.qcNamePlaceholder")}
              className="text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="qc-phone" className="text-xs font-medium">
              {t("step3.qcPhone")} *
            </Label>
            <Input
              id="qc-phone"
              value={auditData.qcContactPhone}
              onChange={(e) =>
                onChange({ ...auditData, qcContactPhone: e.target.value })
              }
              placeholder="e.g. +91 98765 43210"
              className="font-mono text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="qc-email" className="text-xs font-medium">
              {t("step3.qcEmail")}
            </Label>
            <Input
              id="qc-email"
              type="email"
              value={auditData.qcContactEmail}
              onChange={(e) =>
                onChange({ ...auditData, qcContactEmail: e.target.value })
              }
              placeholder="e.g. qc.lead@example.com"
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Surveillance Readiness Checklist */}
      <div className="elevation-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="size-4 text-primary" aria-hidden />
            <h3 className="text-sm font-semibold text-foreground">
              {t("step3.checklistSection")}
            </h3>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {t("step3.checklistHelp")}
        </p>

        <div className="flex flex-col gap-3">
          {(
            [
              "qcLabCalibrated",
              "markingEquipmentOperational",
              "testRecordsAvailable",
              "sampleBatchReady",
            ] as const
          ).map((itemKey) => {
            const isChecked = auditData.checklist[itemKey];
            return (
              <div
                key={itemKey}
                onClick={() => handleChecklistToggle(itemKey)}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-xs transition-colors",
                  isChecked
                    ? "border-emerald-500/40 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                    : "border-border bg-background hover:bg-muted/40",
                )}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => handleChecklistToggle(itemKey)}
                  className="mt-0.5"
                />
                <div className="flex flex-1 items-center justify-between gap-2">
                  <span
                    className={cn(
                      "leading-relaxed",
                      isChecked
                        ? "text-foreground font-medium"
                        : "text-muted-foreground",
                    )}
                  >
                    {t(`step3.checklist.${itemKey}`)}
                  </span>
                  {isChecked && (
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Document Uploads (optional, illustrative) */}
      <div className="elevation-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 border-b border-border/70 pb-3">
          <FileText className="size-4 text-primary" aria-hidden />
          <h3 className="text-sm font-semibold text-foreground">
            {t("step3.uploadsSection")}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-3.5">
            <span className="text-xs font-semibold text-foreground">
              {t("step3.calibrationDoc")}
            </span>
            {calibFileName ? (
              <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate font-medium">{calibFileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCalibFileName(null);
                    onChange({
                      ...auditData,
                      calibrationFileName: undefined,
                    });
                  }}
                  className="p-1 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-3 py-3 text-xs text-muted-foreground hover:bg-muted/40">
                <FileUp className="size-4 text-primary" />
                <span>{t("step3.uploadCalibration")}</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setCalibFileName(f.name);
                      onChange({ ...auditData, calibrationFileName: f.name });
                    }
                  }}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-3.5">
            <span className="text-xs font-semibold text-foreground">
              {t("step3.testLogDoc")}
            </span>
            {testLogFileName ? (
              <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate font-medium">
                    {testLogFileName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTestLogFileName(null);
                    onChange({
                      ...auditData,
                      internalTestLogFileName: undefined,
                    });
                  }}
                  className="p-1 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-3 py-3 text-xs text-muted-foreground hover:bg-muted/40">
                <FileUp className="size-4 text-primary" />
                <span>{t("step3.uploadTestLog")}</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setTestLogFileName(f.name);
                      onChange({
                        ...auditData,
                        internalTestLogFileName: f.name,
                      });
                    }
                  }}
                  className="sr-only"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="elevation-1 flex flex-col gap-2 rounded-2xl border border-border bg-card p-5">
        <Label htmlFor="audit-notes" className="text-xs font-medium">
          {t("step3.notesSection")}
        </Label>
        <Textarea
          id="audit-notes"
          value={auditData.preAuditNotes}
          onChange={(e) =>
            onChange({ ...auditData, preAuditNotes: e.target.value })
          }
          placeholder={t("step3.notesPlaceholder")}
          rows={3}
          className="text-xs resize-none"
        />
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border/60 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-xl px-5"
        >
          {t("step3.backBtn")}
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          size="lg"
          className="rounded-xl px-6 font-semibold shadow-sm"
        >
          {t("step3.nextBtn")}
        </Button>
      </div>
    </div>
  );
}
