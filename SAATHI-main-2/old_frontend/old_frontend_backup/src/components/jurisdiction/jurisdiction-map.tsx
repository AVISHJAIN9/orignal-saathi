import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { JurisdictionData } from "@/lib/mock-jurisdictions";

interface JurisdictionMapProps {
  jurisdictions: JurisdictionData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function JurisdictionMap({
  jurisdictions,
  selectedId,
  onSelect,
}: JurisdictionMapProps) {
  const { t } = useTranslation("jurisdiction");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hoveredJurisdiction = jurisdictions.find((j) => j.id === hoveredId);

  return (
    <div className="elevation-1 relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      {/* Map Header bar */}
      <div className="flex items-center justify-between border-b border-border/80 bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
            {t("map.gridLabel")}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-primary" />{" "}
            {t("map.bisAligned")}
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-amber-500" />{" "}
            {t("map.activeUpdates")}
          </span>
        </div>
      </div>

      {/* SVG Interactive World Map */}
      <div className="relative aspect-[2/1] min-h-[300px] w-full bg-gradient-to-b from-card via-card/90 to-accent/20 p-2 sm:p-4">
        <svg
          viewBox="0 0 1000 500"
          className="h-full w-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="jurisdiction-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border/40"
              />
            </pattern>

            <linearGradient
              id="jurisdiction-trade-beam"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <rect width="1000" height="500" fill="url(#jurisdiction-grid)" />

          {/* Stylized landmass contours — not real geodata */}
          <g className="fill-muted/40 stroke-border/60 stroke-[0.8]">
            <path d="M 120 110 C 140 80, 260 70, 310 120 C 330 160, 270 240, 220 250 C 190 260, 160 210, 130 170 Z" />
            <path d="M 170 260 C 190 270, 220 310, 200 330 C 180 320, 160 290, 170 260 Z" />
            <path d="M 270 290 C 340 300, 380 370, 340 450 C 300 480, 270 420, 260 360 Z" />
            <path d="M 450 110 C 530 90, 560 140, 530 190 C 490 200, 460 170, 450 110 Z" />
            <path d="M 470 210 C 560 200, 600 270, 570 370 C 540 430, 490 410, 470 320 Z" />
            <path d="M 580 90 C 720 70, 890 110, 880 230 C 820 270, 700 280, 640 220 Z" />
            <path d="M 680 210 C 720 210, 750 250, 720 310 C 690 280, 670 240, 680 210 Z" />
            <path d="M 800 340 C 900 330, 920 410, 860 450 C 810 440, 790 380, 800 340 Z" />
          </g>

          {/* Trade corridors to India (710, 260) */}
          {jurisdictions.map((j) => {
            if (j.id === "in") return null;
            const isSelected = selectedId === j.id;
            return (
              <line
                key={`line-${j.id}`}
                x1="710"
                y1="260"
                x2={j.coordinates.x}
                y2={j.coordinates.y}
                stroke="url(#jurisdiction-trade-beam)"
                strokeWidth={isSelected ? "2" : "1"}
                strokeDasharray={isSelected ? "none" : "4,4"}
                className="opacity-40 transition-all hover:opacity-100"
              />
            );
          })}

          {/* Interactive jurisdiction markers */}
          {jurisdictions.map((j) => {
            const isSelected = selectedId === j.id;
            const isHovered = hoveredId === j.id;

            return (
              <g
                key={j.id}
                transform={`translate(${j.coordinates.x}, ${j.coordinates.y})`}
                onClick={() => onSelect(j.id)}
                onMouseEnter={() => setHoveredId(j.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="cursor-pointer"
              >
                {(j.status === "active_changes" || isSelected) && (
                  <circle
                    r={isSelected ? "24" : "18"}
                    className={`animate-ping opacity-30 ${
                      j.status === "active_changes"
                        ? "fill-amber-500"
                        : "fill-primary"
                    }`}
                  />
                )}

                <circle
                  r={isSelected ? "18" : isHovered ? "16" : "13"}
                  className={`transition-all duration-300 ${
                    isSelected
                      ? "fill-primary/20 stroke-primary stroke-2"
                      : isHovered
                        ? "fill-primary/10 stroke-primary/80 stroke-1.5"
                        : "fill-card stroke-border stroke-1"
                  }`}
                />

                <circle
                  r={isSelected ? "8" : "6"}
                  className={
                    isSelected
                      ? "fill-primary"
                      : j.id === "in"
                        ? "fill-emerald-500"
                        : j.status === "active_changes"
                          ? "fill-amber-500"
                          : "fill-secondary"
                  }
                />

                <text
                  x="0"
                  y="-16"
                  textAnchor="middle"
                  className={`font-mono text-[11px] font-bold transition-all ${
                    isSelected
                      ? "fill-primary font-extrabold"
                      : "fill-foreground/90"
                  }`}
                >
                  {j.flag} {j.code}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating tooltip for the hovered marker */}
        {hoveredJurisdiction && (
          <div
            className="elevation-3 pointer-events-none absolute z-20 flex flex-col gap-1 rounded-xl border border-border bg-card/95 p-3 backdrop-blur-md"
            style={{
              left: `clamp(10px, ${hoveredJurisdiction.coordinates.x / 10}%, calc(100% - 220px))`,
              top: `clamp(10px, ${hoveredJurisdiction.coordinates.y / 5}%, calc(100% - 100px))`,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{hoveredJurisdiction.flag}</span>
              <span className="text-xs font-bold text-foreground">
                {hoveredJurisdiction.name}
              </span>
            </div>
            <span className="max-w-[200px] truncate text-[11px] text-muted-foreground">
              {hoveredJurisdiction.primaryAuthority}
            </span>
            <div className="flex items-center justify-between gap-3 border-t border-border pt-1 font-mono text-[10px]">
              <span className="font-semibold text-primary">
                {t("drawer.alignmentScore")}:{" "}
                {hoveredJurisdiction.bisRelationship.alignmentScore}%
              </span>
              <span className="text-muted-foreground capitalize">
                {hoveredJurisdiction.region}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
