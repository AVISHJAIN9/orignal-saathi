import { useId } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TopicChartDatum {
  topic: string;
  count: number;
}

const tickStyle = { fill: "var(--muted-foreground)", fontSize: 12 };
const labelStyle = { fill: "var(--muted-foreground)", fontSize: 11 };
const averageLabelStyle = { fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 500 };

export function TopicsBarChart({
  data,
  seriesName,
  average,
  averageLabel,
}: {
  data: TopicChartDatum[];
  seriesName: string;
  average: number;
  averageLabel: string;
}) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `bar-gradient-${uid}`;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 8, left: 0, bottom: 8 }}>
          <defs>
            {/* Vertical shading (lighter at top / darker at bottom) plus a
                crisp bright band in the first few percent to read as a thin
                highlight along each bar's top edge, then it drops into the
                same shading as before — 2D only, no perspective. */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="color-mix(in oklch, var(--primary) 100%, white 50%)" />
              <stop offset="4%" stopColor="color-mix(in oklch, var(--primary) 100%, white 50%)" />
              <stop offset="4.5%" stopColor="color-mix(in oklch, var(--primary) 100%, white 22%)" />
              <stop offset="100%" stopColor="color-mix(in oklch, var(--primary) 100%, black 12%)" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="2 4"
            stroke="var(--border)"
            strokeOpacity={0.6}
            vertical={false}
          />
          <XAxis
            dataKey="topic"
            tick={tickStyle}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={44}
          />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={36} />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--popover-foreground)",
            }}
          />
          <ReferenceLine
            y={average}
            stroke="var(--muted-foreground)"
            strokeOpacity={0.6}
            strokeDasharray="4 4"
            label={{ value: averageLabel, position: "insideTopRight", style: averageLabelStyle }}
          />
          <Bar
            dataKey="count"
            name={seriesName}
            fill={`url(#${gradientId})`}
            radius={[3, 3, 0, 0]}
            style={{
              filter:
                "drop-shadow(0 3px 3px color-mix(in oklch, var(--foreground) 18%, transparent))",
            }}
            isAnimationActive
            animationDuration={800}
            animationEasing="ease-out"
          >
            <LabelList dataKey="count" position="top" style={labelStyle} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
