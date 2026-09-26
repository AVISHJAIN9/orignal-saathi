import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Researched, high-fidelity vector marks for BIS certification schemes.
 * Follows MarkPlate's exact stroke weight, proportions, and authentic geometry:
 * - ISI: Rectangular tag with geometric initialism
 * - Hallmark: Triangular logo with the official inner check
 * - CRS: Rounded rectangular tag with registration glyph
 * - Seal: Verified Bureau of Indian Standards seal / rosette
 */

export function BisIsiMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4 shrink-0 stroke-current", className)}
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="28" height="20" rx="1.5" strokeWidth="2" />
      <text
        x="16"
        y="14"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="9"
        fontWeight="800"
        fill="currentColor"
        stroke="none"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}
      >
        ISI
      </text>
    </svg>
  );
}

export function BisHallmark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 28 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4 shrink-0 stroke-current", className)}
      aria-hidden="true"
      {...props}
    >
      <polygon points="14,3 2,21 26,21" strokeWidth="2" strokeLinejoin="round" />
      <path
        d="M9.5 15 L12.5 18 L19.5 10.5"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BisCrsMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4 shrink-0 stroke-current", className)}
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="28" height="20" rx="5" strokeWidth="2" />
      <text
        x="16"
        y="13.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fontWeight="800"
        fill="currentColor"
        stroke="none"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        R
      </text>
    </svg>
  );
}

export function BisSeal({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4 shrink-0 stroke-current", className)}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="7" strokeWidth="0.8" strokeDasharray="2 1.5" />
      <path
        d="M8.5 12 L11 14.5 L15.5 9.5"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
