import { FlaskConical, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { TestingState } from "@/lib/mock-registration";

interface TestingLabStepProps {
  testing: TestingState;
}

/**
 * Sourced from C7 (Laboratory Matcher) — which doesn't exist in this repo
 * yet (see Step 0 of the S3 task). `labMatchingAvailable` is false for
 * every seeded standard, so this always renders the honest fallback
 * below rather than a fabricated lab recommendation.
 */
export function TestingLabStep({ testing }: TestingLabStepProps) {
  const { t } = useTranslation("registration");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {t("testing.requiredTestsHeading")}
        </h3>
        {testing.tests.length > 0 ? (
          <ul className="flex flex-col gap-1.5">
            {testing.tests.map((test) => (
              <li
                key={test.key}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
              >
                <FlaskConical
                  className="size-4 shrink-0 text-primary"
                  aria-hidden
                />
                {test.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("testing.noTests")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {t("testing.labHeading")}
        </h3>
        {testing.labMatchingAvailable && testing.recommendedLab ? (
          <div className="elevation-1 flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
            <span className="text-sm font-semibold text-foreground">
              {testing.recommendedLab.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {testing.recommendedLab.location}
            </span>
            <span className="text-xs text-muted-foreground">
              {testing.recommendedLab.accreditation}
            </span>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-border bg-muted/20 p-4">
            <Info
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("testing.labMatchingUnavailable")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
