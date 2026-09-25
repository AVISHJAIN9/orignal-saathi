import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FormField } from "@/components/registration/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MOCK_STANDARDS } from "@/lib/mock-standards";
import {
  getStandardLabel,
  suggestStandard,
  type ProductDetails,
} from "@/lib/mock-registration";
import type { ProductFieldErrors } from "@/lib/registration-validation";

const CATEGORY_KEYS = Array.from(
  new Set(MOCK_STANDARDS.map((s) => s.categoryKey)),
);

interface ProductDetailsStepProps {
  value: ProductDetails;
  errors: ProductFieldErrors;
  onChange: (value: ProductDetails) => void;
}

export function ProductDetailsStep({
  value,
  errors,
  onChange,
}: ProductDetailsStepProps) {
  const { t } = useTranslation(["registration", "admin"]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Re-fetch the suggestion whenever the category changes — never derived
  // client-side, always the mock-registrationApi's answer (see
  // suggestStandard in mock-registration.ts).
  useEffect(() => {
    if (!value.categoryKey) return;
    let cancelled = false;
    setIsSuggesting(true);
    suggestStandard(value.categoryKey).then((standard) => {
      if (cancelled) return;
      setIsSuggesting(false);
      onChange({ ...value, suggestedStandardKey: standard?.key ?? null });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.categoryKey]);

  const suggestedStandard = getStandardLabel(value.suggestedStandardKey);

  return (
    <div className="flex flex-col gap-4">
      <FormField
        label={t("registration:product.productNameLabel")}
        htmlFor="product-name"
        error={errors.productName}
      >
        <Input
          id="product-name"
          value={value.productName}
          onChange={(e) => onChange({ ...value, productName: e.target.value })}
          aria-invalid={errors.productName ? true : undefined}
        />
      </FormField>

      <FormField
        label={t("registration:product.categoryLabel")}
        htmlFor="product-category"
        error={errors.categoryKey}
      >
        <Select
          value={value.categoryKey}
          onValueChange={(next) =>
            onChange({
              ...value,
              categoryKey: next,
              suggestedStandardKey: null,
            })
          }
        >
          <SelectTrigger
            id="product-category"
            aria-invalid={errors.categoryKey ? true : undefined}
          >
            <SelectValue
              placeholder={t("registration:product.categoryPlaceholder")}
            />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_KEYS.map((key) => (
              <SelectItem key={key} value={key}>
                {t(`admin:topics.${key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        label={t("registration:product.descriptionLabel")}
        htmlFor="product-description"
        error={errors.productDescription}
      >
        <Textarea
          id="product-description"
          rows={3}
          value={value.productDescription}
          onChange={(e) =>
            onChange({ ...value, productDescription: e.target.value })
          }
          aria-invalid={errors.productDescription ? true : undefined}
        />
      </FormField>

      {value.categoryKey && (
        <div className="elevation-1 flex flex-col gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            {t("registration:product.suggestedStandardBadge")}
          </div>
          {isSuggesting ? (
            <p className="text-sm text-muted-foreground">
              {t("registration:product.suggesting")}
            </p>
          ) : suggestedStandard ? (
            <>
              <p className="font-mono text-sm font-semibold text-foreground">
                {suggestedStandard.standardNumber}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t("registration:product.suggestionDisclaimer")}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("registration:product.noSuggestion")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
