import { cn } from "@/lib/utils";

/**
 * The SAATHI "stamp" mark: an S set in a rounded square filled with the
 * primary colour, echoing the certification-plate motif from the landing
 * page (see src/components/landing/mark-plate.tsx) so the chat product
 * carries the same identity as the marketing site rather than reading as a
 * generic chatbot. Sizes are kept in one place so the sidebar, chat header,
 * and bot-message avatar all stamp the same mark at different scales.
 */
export function BrandMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md bg-primary font-semibold text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.18),var(--shadow-elevation-1)]",
        size === "sm" ? "size-6 text-xs" : "size-8 text-base",
        className,
      )}
    >
      S
    </span>
  );
}
