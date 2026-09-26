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
import type { BusinessDetails, BusinessType } from "@/lib/mock-registration";
import {
  INDIA_STATES,
  type BusinessFieldErrors,
} from "@/lib/registration-validation";

const BUSINESS_TYPES: BusinessType[] = [
  "sole_proprietorship",
  "partnership",
  "private_limited",
  "public_limited",
  "other",
];

interface BusinessDetailsStepProps {
  value: BusinessDetails;
  errors: BusinessFieldErrors;
  onChange: (value: BusinessDetails) => void;
}

export function BusinessDetailsStep({
  value,
  errors,
  onChange,
}: BusinessDetailsStepProps) {
  const { t } = useTranslation("registration");
  const cities =
    INDIA_STATES.find((state) => state.key === value.state)?.cities ?? [];

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {t("business.orgSectionHeading")}
        </h3>
        <FormField
          label={t("business.organizationNameLabel")}
          htmlFor="business-org-name"
          error={errors.organizationName}
        >
          <Input
            id="business-org-name"
            value={value.organizationName}
            onChange={(e) =>
              onChange({ ...value, organizationName: e.target.value })
            }
            aria-invalid={errors.organizationName ? true : undefined}
          />
        </FormField>
        <FormField
          label={t("business.businessTypeLabel")}
          htmlFor="business-type"
          error={errors.businessType}
        >
          <Select
            value={value.businessType}
            onValueChange={(next) =>
              onChange({ ...value, businessType: next as BusinessType })
            }
          >
            <SelectTrigger
              id="business-type"
              aria-invalid={errors.businessType ? true : undefined}
            >
              <SelectValue
                placeholder={t("business.businessTypePlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`business.businessTypes.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </section>

      <section className="flex flex-col gap-4 border-t border-border pt-4">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {t("business.addressSectionHeading")}
        </h3>
        <FormField
          label={t("business.addressLine1Label")}
          htmlFor="business-address1"
          error={errors.addressLine1}
        >
          <Input
            id="business-address1"
            value={value.addressLine1}
            onChange={(e) =>
              onChange({ ...value, addressLine1: e.target.value })
            }
            aria-invalid={errors.addressLine1 ? true : undefined}
          />
        </FormField>
        <FormField
          label={t("business.addressLine2Label")}
          htmlFor="business-address2"
        >
          <Input
            id="business-address2"
            value={value.addressLine2}
            onChange={(e) =>
              onChange({ ...value, addressLine2: e.target.value })
            }
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            label={t("business.stateLabel")}
            htmlFor="business-state"
            error={errors.state}
          >
            <Select
              value={value.state}
              onValueChange={(next) =>
                onChange({ ...value, state: next, city: "" })
              }
            >
              <SelectTrigger
                id="business-state"
                aria-invalid={errors.state ? true : undefined}
              >
                <SelectValue placeholder={t("business.statePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {INDIA_STATES.map((state) => (
                  <SelectItem key={state.key} value={state.key}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            label={t("business.cityLabel")}
            htmlFor="business-city"
            error={errors.city}
          >
            <Select
              value={value.city}
              onValueChange={(next) => onChange({ ...value, city: next })}
              disabled={!value.state}
            >
              <SelectTrigger
                id="business-city"
                aria-invalid={errors.city ? true : undefined}
              >
                <SelectValue placeholder={t("business.cityPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            label={t("business.pincodeLabel")}
            htmlFor="business-pincode"
            error={errors.pincode}
          >
            <Input
              id="business-pincode"
              inputMode="numeric"
              value={value.pincode}
              onChange={(e) => onChange({ ...value, pincode: e.target.value })}
              aria-invalid={errors.pincode ? true : undefined}
            />
          </FormField>
        </div>
      </section>
    </div>
  );
}
