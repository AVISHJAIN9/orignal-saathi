import { Check } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface StepDescriptor {
  key: string;
  label: string;
}

interface RegistrationStepperProps {
  steps: StepDescriptor[];
  currentIndex: number;
  stepOfLabel: string;
}

/**
 * Completed/current/upcoming is never color-only: completed steps pair a
 * checkmark icon with a distinct fill, the current step gets a filled dot
 * plus bold label text, and upcoming steps stay outlined — so the state
 * still reads correctly for someone who can't distinguish the colors.
 *
 * Desktop shows the full horizontal stepper; mobile switches to a compact
 * "Step X of 6" line + progress bar instead of squeezing the same stepper
 * into a narrow width.
 */
export function RegistrationStepper({
  steps,
  currentIndex,
  stepOfLabel,
}: RegistrationStepperProps) {
  return (
    <div className="sticky top-14 z-20 rounded-2xl border border-border/60 bg-card/90 p-3.5 backdrop-blur-md shadow-xs">
      <ol className="hidden items-start gap-1 sm:flex">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <li
              key={step.key}
              className="flex flex-1 flex-col items-center gap-1.5 last:flex-none"
            >
              <div className="flex w-full items-center">
                <span
                  aria-hidden
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-background text-primary",
                    !isCompleted &&
                      !isCurrent &&
                      "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-3.5" aria-hidden />
                  ) : (
                    index + 1
                  )}
                </span>
                {index < steps.length - 1 && (
                  <span
                    aria-hidden
                    className={cn(
                      "mx-1 h-0.5 flex-1 rounded-full",
                      isCompleted ? "bg-primary" : "bg-border",
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "max-w-[6.5rem] text-center text-2xs leading-tight",
                  isCurrent
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-1.5 sm:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-foreground">
            {steps[currentIndex]?.label}
          </span>
          <span className="text-xs text-muted-foreground">{stepOfLabel}</span>
        </div>
        <Progress value={((currentIndex + 1) / steps.length) * 100} />
      </div>
    </div>
  );
}
