import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/router-compat";

export function BackToHomeLink() {
  return (
    <Link
      to="/"
      aria-label="Back to home"
      title="Back to home"
      className="group elevation-lift inline-flex size-10 items-center justify-center rounded-xl border border-white/70 bg-white/30 text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-[color,background-color,box-shadow,transform] duration-200 hover:-translate-x-0.5 hover:bg-white/60 hover:text-primary"
    >
      <ArrowLeft
        className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
        aria-hidden
      />
      <span className="sr-only">Back to home</span>
    </Link>
  );
}
