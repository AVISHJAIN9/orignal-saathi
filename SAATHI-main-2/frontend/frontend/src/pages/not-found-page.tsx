import { Home, ShieldAlert } from "lucide-react";

import { AmbientBackground } from "@/components/ambient-background";
import { BrandMark } from "@/components/brand-mark";
import { Reveal } from "@/components/landing/reveal";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";

/** 404 fallback — reuses the app's verification identity (ShieldCheck pill in
 * app-sidebar, guilloché AmbientBackground) but in its "breach" state to read
 * as an alert rather than a generic error page. Entrance uses the same
 * fade+lift Reveal used across the landing page, staggered the same way
 * about-section.tsx cascades its pieces in. */
export function NotFoundPage() {
  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-background px-6">
      <AmbientBackground />
      <div className="relative z-10 flex max-w-md flex-col items-center gap-5 text-center">
        <Reveal className="flex flex-col items-center gap-5">
          <BrandMark className="shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_18px_rgba(12,50,86,0.14)]" />

          <div className="elevation-1 inline-flex items-center gap-2 rounded-full border border-destructive/25 bg-destructive/10 px-3.5 py-1.5">
            <ShieldAlert className="size-3.5 text-destructive" aria-hidden />
            <span className="font-mono text-[0.62rem] font-semibold tracking-[0.18em] text-destructive uppercase">
              Protocol Breach
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="font-serif text-8xl leading-none font-semibold tracking-tight text-foreground tabular-nums sm:text-9xl">
            404
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            The requested knowledge node could not be located.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <Link
            to="/"
            className={cn(buttonVariants({ size: "lg" }), "mt-2 gap-1.5")}
          >
            <Home className="size-4" aria-hidden />
            Return to Command Center
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
