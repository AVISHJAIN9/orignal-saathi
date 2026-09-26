import { useTranslation } from "react-i18next";

import { FormField } from "@/components/registration/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApplicantDetails, ApplicantType } from "@/lib/mock-registration";
import type { ApplicantFieldErrors } from "@/lib/registration-validation";

const APPLICANT_TYPES: ApplicantType[] = [
  "manufacturer",
  "importer",
  "dealer",
  "individual",
];

interface ApplicantDetailsStepProps {
  value: ApplicantDetails;
  errors: ApplicantFieldErrors;
  onChange: (value: ApplicantDetails) => void;
}

export function ApplicantDetailsStep({
  value,
  errors,
  onChange,
}: ApplicantDetailsStepProps) {
  const { t } = useTranslation("registration");

  return (
    <div className="flex flex-col gap-4">
      <FormField
        label={t("applicant.fullNameLabel")}
        htmlFor="applicant-name"
        error={errors.fullName}
      >
        <Input
          id="applicant-name"
          value={value.fullName}
          onChange={(e) => onChange({ ...value, fullName: e.target.value })}
          aria-invalid={errors.fullName ? true : undefined}
          aria-describedby={
            errors.fullName ? "applicant-name-error" : undefined
          }
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label={t("applicant.emailLabel")}
          htmlFor="applicant-email"
          error={errors.email}
        >
          <Input
            id="applicant-email"
            type="email"
            value={value.email}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={
              errors.email ? "applicant-email-error" : undefined
            }
          />
        </FormField>
        <FormField
          label={t("applicant.phoneLabel")}
          htmlFor="applicant-phone"
          error={errors.phone}
        >
          <Input
            id="applicant-phone"
            type="tel"
            inputMode="numeric"
            placeholder={t("applicant.phonePlaceholder")}
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={
              errors.phone ? "applicant-phone-error" : undefined
            }
          />
        </FormField>
      </div>

      <FormField
        label={t("applicant.typeLabel")}
        htmlFor="applicant-type"
        error={errors.applicantType}
      >
        <Select
          value={value.applicantType}
          onValueChange={(next) =>
            onChange({ ...value, applicantType: next as ApplicantType })
          }
        >
          <SelectTrigger
            id="applicant-type"
            aria-invalid={errors.applicantType ? true : undefined}
          >
            <SelectValue placeholder={t("applicant.typePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {APPLICANT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {t(`applicant.types.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    </div>
  );
}
