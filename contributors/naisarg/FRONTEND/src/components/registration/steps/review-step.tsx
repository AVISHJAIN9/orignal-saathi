import { Pencil, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getStandardLabel, type Application } from "@/lib/mock-registration";

interface ReviewStepProps {
  application: Application;
  onEditStep: (stepIndex: number) => void;
  confirmed: boolean;
  onConfirmedChange: (confirmed: boolean) => void;
}

function SummarySection({
  title,
  onEdit,
  editLabel,
  rows,
}: {
  title: string;
  onEdit: () => void;
  editLabel: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-xs font-medium text-primary underline underline-offset-4"
        >
          <Pencil className="size-3" aria-hidden />
          {editLabel}
        </button>
      </div>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col">
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="truncate font-medium text-foreground">
              {row.value || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ReviewStep({
  application,
  onEditStep,
  confirmed,
  onConfirmedChange,
}: ReviewStepProps) {
  const { t } = useTranslation(["registration", "admin"]);
  const standard = getStandardLabel(application.product.suggestedStandardKey);

  return (
    <div className="flex flex-col gap-3">
      {application.reappliedFromId && (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
          <RefreshCw className="size-3.5 shrink-0" aria-hidden />
          {t("registration:review.reappliedFrom", {
            id: application.reappliedFromId,
          })}
        </div>
      )}

      <SummarySection
        title={t("registration:steps.applicant")}
        onEdit={() => onEditStep(0)}
        editLabel={t("registration:review.edit")}
        rows={[
          {
            label: t("registration:applicant.fullNameLabel"),
            value: application.applicant.fullName,
          },
          {
            label: t("registration:applicant.emailLabel"),
            value: application.applicant.email,
          },
          {
            label: t("registration:applicant.phoneLabel"),
            value: application.applicant.phone,
          },
          {
            label: t("registration:applicant.typeLabel"),
            value: application.applicant.applicantType
              ? t(
                  `registration:applicant.types.${application.applicant.applicantType}`,
                )
              : "",
          },
        ]}
      />

      <SummarySection
        title={t("registration:steps.business")}
        onEdit={() => onEditStep(1)}
        editLabel={t("registration:review.edit")}
        rows={[
          {
            label: t("registration:business.organizationNameLabel"),
            value: application.business.organizationName,
          },
          {
            label: t("registration:business.businessTypeLabel"),
            value: application.business.businessType
              ? t(
                  `registration:business.businessTypes.${application.business.businessType}`,
                )
              : "",
          },
          {
            label: t("registration:business.addressLine1Label"),
            value: application.business.addressLine1,
          },
          {
            label: t("registration:business.cityLabel"),
            value: [application.business.city, application.business.pincode]
              .filter(Boolean)
              .join(" — "),
          },
        ]}
      />

      <SummarySection
        title={t("registration:steps.product")}
        onEdit={() => onEditStep(2)}
        editLabel={t("registration:review.edit")}
        rows={[
          {
            label: t("registration:product.productNameLabel"),
            value: application.product.productName,
          },
          {
            label: t("registration:product.categoryLabel"),
            value: application.product.categoryKey
              ? t(`admin:topics.${application.product.categoryKey}`)
              : "",
          },
          {
            label: t("registration:product.suggestedStandardBadge"),
            value: standard?.standardNumber ?? "",
          },
        ]}
      />

      <SummarySection
        title={t("registration:steps.documents")}
        onEdit={() => onEditStep(3)}
        editLabel={t("registration:review.edit")}
        rows={application.documents.map((doc) => ({
          label: doc.label,
          value: t(`registration:documents.status.${doc.status}`),
        }))}
      />

      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/30 p-4">
        <Checkbox
          id="review-confirm"
          checked={confirmed}
          onCheckedChange={(checked) => onConfirmedChange(checked === true)}
          className="mt-0.5"
        />
        <Label
          htmlFor="review-confirm"
          className="cursor-pointer text-sm leading-relaxed font-normal"
        >
          {t("registration:review.confirmationLabel")}
        </Label>
      </div>
    </div>
  );
}
