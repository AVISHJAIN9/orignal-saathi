import { BadgeCheck, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Citation } from "@/lib/types";

const CHIP_TITLE_MAX_LENGTH = 40;

function truncateTitle(title: string, maxLength = CHIP_TITLE_MAX_LENGTH) {
  if (title.length <= maxLength) return title;
  const cut = title.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

function formatChipLabel(citation: Citation) {
  return [citation.standardNumber, truncateTitle(citation.title)].filter(Boolean).join(" — ");
}

/**
 * A tappable citation chip. When it appears (an answer just resolved with a
 * verified standard), it "stamps in" — a quick scale-down-then-settle press
 * with the same spring feel as the plate motif on the landing page — led by
 * a BadgeCheck mark, so a landing citation reads as a verification stamp
 * being applied, reinforcing SAATHI's cited-or-decline premise at the exact
 * moment it's proven. The `index` staggers multiple chips so they stamp in
 * one after another rather than all at once.
 */
export function CitationBadge({ citation, index = 0 }: { citation: Citation; index?: number }) {
  const { t } = useTranslation("citation");
  const prefersReducedMotion = useReducedMotion();

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex min-w-0 max-w-full">
            <SheetTrigger
              render={
                <Badge
                  variant="outline"
                  className="max-w-full cursor-pointer"
                  render={<button type="button" />}
                />
              }
            >
              <motion.span
                className="flex min-w-0 items-center gap-1.5"
                initial={prefersReducedMotion ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 480, damping: 16, delay: index * 0.12 }}
              >
                <BadgeCheck className="size-3.5 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0 truncate">{formatChipLabel(citation)}</span>
                <ChevronRight className="size-3 shrink-0 text-muted-foreground" aria-hidden />
              </motion.span>
            </SheetTrigger>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-64 text-center">
          {citation.title}
        </TooltipContent>
      </Tooltip>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{citation.standardNumber}</SheetTitle>
          <SheetDescription>{citation.title}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-4 pb-4 text-sm">
          {citation.section && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t("section")}</p>
              <p className="text-foreground">{citation.section}</p>
            </div>
          )}
          {citation.sourceUrl && (
            <a
              href={citation.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4"
            >
              {t("viewSource")}
            </a>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
