import { useId } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface QueryChartDatum {
  day: string;
  queries: number;
}

const tickStyle = { fill: "var(--muted-foreground)", fontSize: 12 };

export function QueriesLineChart({
  data,
  seriesName,
}: {
  data: QueryChartDatum[];
  seriesName: string;
}) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `line-gradient-${uid}`;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <defs>
            {/* Richer area fill under the line — a deeper navy near the line
                fading through the base accent to transparent — not a
                chart-type change, just a fill behind the same line. */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="color-mix(in oklch, var(--primary) 100%, black 15%)"
                stopOpacity={0.45}
              />
              <stop offset="55%" stopColor="var(--primary)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="2 4"
            stroke="var(--border)"
            strokeOpacity={0.6}
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={tickStyle}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={36} />
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--popover-foreground)",
            }}
          />
          <Area
            type="monotone"
            dataKey="queries"
            stroke="none"
            fill={`url(#${gradientId})`}
            tooltipType="none"
            isAnimationActive
            animationDuration={1000}
            animationEasing="ease-out"
          />
          <Line
            type="monotone"
            dataKey="queries"
            name={seriesName}
            stroke="var(--primary)"
            strokeWidth={3}
            style={{
              filter: "drop-shadow(0 0 5px color-mix(in oklch, var(--primary) 55%, transparent))",
            }}
            dot={{ r: 4, fill: "var(--primary)", stroke: "var(--background)", strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: "var(--background)", strokeWidth: 2 }}
            isAnimationActive
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
