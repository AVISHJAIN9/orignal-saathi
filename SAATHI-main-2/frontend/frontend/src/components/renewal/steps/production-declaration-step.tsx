import { useState } from "react";
import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  FileSpreadsheet,
  Info,
  Sliders,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { DocumentDropzone } from "@/components/admin/document-dropzone";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type {
  ProductionDeclaration,
  RenewalLicence,
} from "@/lib/mock-renewals";

interface ProductionDeclarationStepProps {
  licence: RenewalLicence;
  production: ProductionDeclaration;
  isSurveillanceTriggered: boolean;
  onChange: (updated: ProductionDeclaration) => void;
  onProceed: () => void;
  onBack: () => void;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function ProductionDeclarationStep({
  licence,
  production,
  isSurveillanceTriggered,
  onChange,
  onProceed,
  onBack,
}: ProductionDeclarationStepProps) {
  const { t } = useTranslation("renewal");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [showError, setShowError] = useState(false);

  const rawFee = Math.round(
    production.quantityProduced * licence.markingRatePerUnit,
  );
  const calculatedFee = Math.max(licence.minimumMarkingFee, rawFee);
  const isMinimumApplied = rawFee < licence.minimumMarkingFee;

  const handleQuantityChange = (quantity: number) => {
    const validQty = Math.max(0, quantity);
    onChange({
      ...production,
      quantityProduced: validQty,
    });
  };

  const handleSimulatedUpload = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    setIsSimulatingUpload(true);
    setTimeout(() => {
      setUploadedFile(file.name);
      setIsSimulatingUpload(false);
    }, 400);
  };

  const handleNext = () => {
    if (!production.declarationConfirmed) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onProceed();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          {t("step2.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("step2.subtitle")}
        </p>
      </div>

      {/* Reporting Period & Formula banner */}
      <div className="elevation-1 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="size-4 text-primary" aria-hidden />
            <h3 className="text-sm font-semibold text-foreground">
              {t("step2.reportingPeriod")}
            </h3>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">
            {t("step2.periodValue")}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1 rounded-xl bg-muted/40 p-3">
            <span className="text-xs text-muted-foreground">
              {t("step2.markingRate")}
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              ₹{licence.markingRatePerUnit.toFixed(2)} / unit
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-xl bg-muted/40 p-3">
            <span className="text-xs text-muted-foreground">
              {t("step2.minimumFee")}
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              {currencyFormatter.format(licence.minimumMarkingFee)}
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-xl border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">
                {t("step2.calculatedFee")}
              </span>
              <span className="text-2xs text-muted-foreground">
                {isMinimumApplied ? "Min. Applied" : "Volume Rate"}
              </span>
            </div>
            <span className="font-mono text-base font-bold text-primary">
              {currencyFormatter.format(calculatedFee)}
            </span>
          </div>
        </div>
      </div>

      {/* Production Volume Input & Interactive Slider */}
      <div className="elevation-1 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Sliders className="size-4 text-primary" aria-hidden />
          <h3 className="text-sm font-semibold text-foreground">
            {t("step2.productionQuantity")}
          </h3>
        </div>

        <p className="text-xs text-muted-foreground">{t("step2.sliderHint")}</p>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[production.quantityProduced]}
                min={0}
                max={200000}
                step={1000}
                onValueChange={([val]) => handleQuantityChange(val)}
                className="w-full"
              />
            </div>
            <div className="flex w-36 shrink-0 items-center gap-1.5">
              <Input
                type="number"
                min={0}
                value={production.quantityProduced}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value, 10) || 0)
                }
                className="font-mono text-sm font-semibold text-right"
              />
              <span className="text-xs text-muted-foreground">units</span>
            </div>
          </div>

          <div className="flex justify-between text-2xs text-muted-foreground">
            <span>0 units (Min Fee applies)</span>
            <span>50,000 units</span>
            <span>100,000 units</span>
            <span>200,000+ units</span>
          </div>

          {/* Dynamic math visualizer */}
          <div className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-foreground">
                Fee Computation Logic:
              </span>
              <span>
                {production.quantityProduced.toLocaleString()} units × ₹
                {licence.markingRatePerUnit} ={" "}
                <strong className="font-mono text-foreground">
                  {currencyFormatter.format(rawFee)}
                </strong>
                {isMinimumApplied ? (
                  <span>
                    {" "}
                    (below statutory minimum of{" "}
                    <strong className="font-mono text-foreground">
                      {currencyFormatter.format(licence.minimumMarkingFee)}
                    </strong>
                    ; minimum applied).
                  </span>
                ) : (
                  <span>
                    {" "}
                    (exceeds minimum threshold; calculated volume rate applies).
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Turnover input */}
        <div className="grid grid-cols-1 gap-4 border-t border-border/60 pt-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="turnover" className="text-xs font-medium">
              {t("step2.turnover")}
            </Label>
            <Input
              id="turnover"
              type="number"
              value={production.productionTurnover}
              onChange={(e) =>
                onChange({
                  ...production,
                  productionTurnover: parseInt(e.target.value, 10) || 0,
                })
              }
              className="font-mono text-sm"
              placeholder="e.g. 45000000"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">
              {t("step2.productionUpload")}
            </Label>
            {uploadedFile ? (
              <div className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate font-medium text-foreground">
                    {uploadedFile}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                  title="Remove file"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ) : (
              <DocumentDropzone
                size="compact"
                multiple={false}
                accept=".pdf,.xlsx,.csv"
                onFilesAdded={handleSimulatedUpload}
                title={
                  isSimulatingUpload
                    ? t("step2.attachingFile")
                    : t("step2.attachStatement")
                }
                hint="PDF, XLSX, CSV"
                className="rounded-xl"
              />
            )}
          </div>
        </div>
      </div>

      {/* Statutory Attestation */}
      <div className="elevation-1 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <Checkbox
            id="declaration-attest"
            checked={production.declarationConfirmed}
            onCheckedChange={(checked) => {
              onChange({
                ...production,
                declarationConfirmed: Boolean(checked),
              });
              if (checked) setShowError(false);
            }}
            className="mt-1"
          />
          <label
            htmlFor="declaration-attest"
            className="cursor-pointer text-xs leading-relaxed text-foreground"
          >
            {t("step2.attestation")}
          </label>
        </div>

        {showError && (
          <div className="flex items-center gap-2 text-xs font-semibold text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>
              Please affirm the statutory production declaration to continue.
            </span>
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between border-t border-border/60 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-xl px-5"
        >
          {t("step2.backBtn")}
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          size="lg"
          className="rounded-xl px-6 font-semibold shadow-sm"
        >
          {isSurveillanceTriggered
            ? t("step2.nextBtn")
            : t("step2.nextBtnRoutine")}
        </Button>
      </div>
    </div>
  );
}
