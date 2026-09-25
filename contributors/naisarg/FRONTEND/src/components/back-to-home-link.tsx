import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/router-compat";

export function BackToHomeLink() {
  return (
    <Link
      to="/"
      aria-label="Back to home"
      title="Back to home"
      className="group elevation-lift inline-flex size-10 items-center justify-center rounded-xl border border-border/70 bg-background/60 text-muted-foreground shadow-[var(--shadow-elevation-1)] transition-[color,background-color,box-shadow,transform] duration-200 hover:-translate-x-0.5 hover:bg-muted hover:text-primary rtl:hover:translate-x-0.5"
    >
      <ArrowLeft
        className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
        aria-hidden
      />
      <span className="sr-only">Back to home</span>
    </Link>
  );
}
