import {
  Building2,
  CookingPot,
  Droplet,
  FileCheck,
  Gem,
  HardHat,
  Plane,
  ShieldCheck,
  TestTube,
  ToyBrick,
  User,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// One icon per option, keyed the same way as the i18n option labels, so each
// wizard row reads at a glance rather than as a plain text list. Kept as a
// single lookup (rather than importing an icon per component) so adding a
// new category/audience/need key later only means adding one line here.
const OPTION_ICONS: Record<CategoryKey | AudienceKey | NeedKey, LucideIcon> = {
  // category
  helmets: HardHat,
  appliances: Zap,
  gold: Gem,
  water: Droplet,
  cookers: CookingPot,
  toys: ToyBrick,
  // audience
  consumer: User,
  commercial: Building2,
  import: Plane,
  // need
  standard: FileCheck,
  certification: ShieldCheck,
  testing: TestTube,
};

const CATEGORY_KEYS = ["helmets", "appliances", "gold", "water", "cookers", "toys"] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

const AUDIENCE_KEYS = ["consumer", "commercial", "import"] as const;
type AudienceKey = (typeof AUDIENCE_KEYS)[number];

const NEED_KEYS = ["standard", "certification", "testing"] as const;
type NeedKey = (typeof NEED_KEYS)[number];

interface WizardAnswers {
  category: CategoryKey | null;
  audience: AudienceKey | null;
  need: NeedKey | null;
}

const EMPTY_ANSWERS: WizardAnswers = { category: null, audience: null, need: null };

// 3 question steps + 1 summary step.
const TOTAL_STEPS = 4;
const TRANSITION = { duration: 0.32, ease: [0.4, 0, 0.2, 1] as const };

// Forward (direction 1) flips the incoming step in from the right edge, as
// if turning a physical card over to its next face; going back (direction
// -1) mirrors both the entry and exit rotation. Real 3D (rotateY + a shift
// in transform-origin toward the leading edge), not a flat slide+fade —
// this is the same "physical object with depth" idea as MarkPlate's tilt
// and the hero demo's stamp impact, applied to step navigation.
const stepVariants: Variants = {
  enter: (direction: 1 | -1) => ({
    rotateY: direction * 62,
    opacity: 0,
    x: direction * 28,
  }),
  center: { rotateY: 0, opacity: 1, x: 0 },
  exit: (direction: 1 | -1) => ({
    rotateY: direction * -62,
    opacity: 0,
    x: direction * -28,
  }),
};

interface WizardQuestionStepProps<K extends keyof typeof OPTION_ICONS> {
  question: string;
  optionKeys: readonly K[];
  selected: K | null;
  onSelect: (key: K) => void;
  getLabel: (key: K) => string;
}

function WizardQuestionStep<K extends keyof typeof OPTION_ICONS>({
  question,
  optionKeys,
  selected,
  onSelect,
  getLabel,
}: WizardQuestionStepProps<K>) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-foreground">{question}</h3>
      <div className="flex flex-col gap-2">
        {optionKeys.map((key) => {
          const Icon: LucideIcon = OPTION_ICONS[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              aria-pressed={selected === key}
              className={cn(
                "elevation-1 elevation-lift flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm font-medium transition-all active:scale-[0.98]",
                selected === key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-foreground hover:bg-muted",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  selected === key ? "text-primary" : "text-muted-foreground",
                )}
                aria-hidden
              />
              {getLabel(key)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

function WizardSummaryStep({
  categoryLabel,
  audienceLabel,
  needLabel,
}: {
  categoryLabel: string;
  audienceLabel: string;
  needLabel: string;
}) {
  const { t } = useTranslation("wizard");
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-foreground">{t("summary.title")}</h3>
      <dl className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm">
        <SummaryRow label={t("summary.category")} value={categoryLabel} />
        <SummaryRow label={t("summary.audience")} value={audienceLabel} />
        <SummaryRow label={t("summary.need")} value={needLabel} />
      </dl>
    </div>
  );
}

function WizardProgress({ step, total, label }: { step: number; total: number; label: string }) {
  const percent = ((step + 1) / total) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={TRANSITION}
        />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

interface ProductClassificationWizardProps {
  onSubmit: (question: string, categoryKey: string) => void;
}

/** D9 — a short guided wizard that turns a few multiple-choice answers into a natural-language question, for visitors who aren't sure how to phrase what they're asking. */
export function ProductClassificationWizard({ onSubmit }: ProductClassificationWizardProps) {
  const { t } = useTranslation("wizard");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<WizardAnswers>(EMPTY_ANSWERS);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      // Reset after the close animation finishes so the dialog doesn't
      // visibly jump back to step 1 while it's still fading out.
      window.setTimeout(() => {
        setStep(0);
        setDirection(1);
        setAnswers(EMPTY_ANSWERS);
      }, 150);
    }
  }

  function goNext() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  function selectCategory(category: CategoryKey) {
    setAnswers((a) => ({ ...a, category }));
    goNext();
  }

  function selectAudience(audience: AudienceKey) {
    setAnswers((a) => ({ ...a, audience }));
    goNext();
  }

  function selectNeed(need: NeedKey) {
    setAnswers((a) => ({ ...a, need }));
    goNext();
  }

  function handleGetAnswer() {
    const { category, audience, need } = answers;
    if (!category || !audience || !need) return;

    const question = t("generatedQuestion", {
      category: t(`steps.category.options.${category}.clause`),
      audience: t(`steps.audience.options.${audience}.clause`),
      needQuestion: t(`steps.need.options.${need}.questionText`),
    });

    onSubmit(question, category);
    handleOpenChange(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 self-start rounded-sm text-xs text-muted-foreground transition-colors outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <Wand2 className="size-3.5" aria-hidden />
        {t("trigger")}
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("dialogTitle")}</DialogTitle>
            <DialogDescription>{t("dialogDescription")}</DialogDescription>
          </DialogHeader>

          <WizardProgress
            step={step}
            total={TOTAL_STEPS}
            label={t("stepOf", { current: step + 1, total: TOTAL_STEPS })}
          />

          <div className="relative min-h-[190px] overflow-hidden" style={{ perspective: 1000 }}>
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={TRANSITION}
                style={{ transformStyle: "preserve-3d" }}
              >
                {step === 0 && (
                  <WizardQuestionStep
                    question={t("steps.category.question")}
                    optionKeys={CATEGORY_KEYS}
                    selected={answers.category}
                    onSelect={selectCategory}
                    getLabel={(key) => t(`steps.category.options.${key}.label`)}
                  />
                )}
                {step === 1 && (
                  <WizardQuestionStep
                    question={t("steps.audience.question")}
                    optionKeys={AUDIENCE_KEYS}
                    selected={answers.audience}
                    onSelect={selectAudience}
                    getLabel={(key) => t(`steps.audience.options.${key}.label`)}
                  />
                )}
                {step === 2 && (
                  <WizardQuestionStep
                    question={t("steps.need.question")}
                    optionKeys={NEED_KEYS}
                    selected={answers.need}
                    onSelect={selectNeed}
                    getLabel={(key) => t(`steps.need.options.${key}.label`)}
                  />
                )}
                {step === 3 && answers.category && answers.audience && answers.need && (
                  <WizardSummaryStep
                    categoryLabel={t(`steps.category.options.${answers.category}.label`)}
                    audienceLabel={t(`steps.audience.options.${answers.audience}.label`)}
                    needLabel={t(`steps.need.options.${answers.need}.label`)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goBack}
              className={cn(step === 0 && "invisible")}
            >
              {t("back")}
            </Button>
            {step === TOTAL_STEPS - 1 && (
              <Button type="button" size="sm" onClick={handleGetAnswer}>
                {t("getAnswer")}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
