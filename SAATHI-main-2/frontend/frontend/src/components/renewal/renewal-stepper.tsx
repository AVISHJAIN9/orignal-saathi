import { motion } from "motion/react";
import { Check, ShieldAlert } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface StepDescriptor {
  key: string;
  label: string;
  isSurveillanceStep?: boolean;
}

interface RenewalStepperProps {
  steps: StepDescriptor[];
  currentIndex: number;
  stepOfLabel: string;
}

export function RenewalStepper({
  steps,
  currentIndex,
  stepOfLabel,
}: RenewalStepperProps) {
  return (
    <div className="w-full">
      <ol className="hidden items-start gap-1 sm:flex">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isSurveillance = Boolean(step.isSurveillanceStep);

          return (
            <motion.li
              key={step.key}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-1 flex-col items-center gap-1.5 last:flex-none"
            >
              <div className="flex w-full items-center">
                <span
                  aria-hidden
                  className={cn(
                    "relative flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground shadow-sm",
                    isCurrent &&
                      !isSurveillance &&
                      "border-primary bg-background text-primary ring-4 ring-primary/15 shadow-sm",
                    isCurrent &&
                      isSurveillance &&
                      "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-4 ring-amber-500/20 shadow-sm",
                    !isCompleted &&
                      !isCurrent &&
                      isSurveillance &&
                      "border-amber-400/60 bg-amber-50/50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400",
                    !isCompleted &&
                      !isCurrent &&
                      !isSurveillance &&
                      "border-border bg-muted/60 text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4" aria-hidden />
                  ) : isSurveillance ? (
                    <ShieldAlert className="size-4" aria-hidden />
                  ) : (
                    index + 1
                  )}
                </span>
                {index < steps.length - 1 && (
                  <span
                    aria-hidden
                    className={cn(
                      "mx-1.5 h-0.5 flex-1 rounded-full transition-colors duration-300",
                      isCompleted ? "bg-primary" : "bg-border/70",
                    )}
                  />
                )}
              </div>

              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "max-w-[7.5rem] text-center text-xs leading-tight transition-colors duration-200",
                    isCurrent
                      ? isSurveillance
                        ? "font-bold text-amber-700 dark:text-amber-400"
                        : "font-semibold text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
                {isSurveillance && (
                  <span className="mt-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.2 font-mono text-2xs font-bold text-amber-700 dark:text-amber-300">
                    Mandatory Audit
                  </span>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>

      {/* Mobile stepper */}
      <div className="flex flex-col gap-2 sm:hidden">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">
              {steps[currentIndex]?.label}
            </span>
            {steps[currentIndex]?.isSurveillanceStep && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-2xs font-bold text-amber-700 dark:text-amber-300">
                Audit Required
              </span>
            )}
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {stepOfLabel}
          </span>
        </div>
        <Progress
          value={((currentIndex + 1) / Math.max(1, steps.length)) * 100}
          className="h-2"
        />
      </div>
    </div>
  );
}
