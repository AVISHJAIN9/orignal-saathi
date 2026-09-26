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
  Legend,
} from "recharts";
import type { GroundednessTimePoint } from "@/lib/demo/s27-demo-data";

interface GroundednessChartProps {
  data: GroundednessTimePoint[];
}

const tickStyle = { fill: "var(--muted-foreground)", fontSize: 11 };

export function GroundednessChart({ data }: GroundednessChartProps) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `grounded-gradient-${uid}`;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 12, right: 12, left: -10, bottom: 8 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="80%" stopColor="#10b981" stopOpacity={0.02} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            strokeOpacity={0.5}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={tickStyle}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            domain={[85, 100]}
            tick={tickStyle}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--popover-foreground)",
            }}
            formatter={(value: any, name: any) => [
              `${value}%`,
              name === "groundednessRate" ? "Groundedness Rate" : "Decline Rate",
            ]}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ fontSize: "11px", paddingBottom: "8px" }}
            formatter={(val) => (val === "groundednessRate" ? "Groundedness Rate (%)" : "Cite-or-Decline Rate (%)")}
          />
          <Area
            type="monotone"
            dataKey="groundednessRate"
            stroke="none"
            fill={`url(#${gradientId})`}
            tooltipType="none"
            isAnimationActive
          />
          <Line
            type="monotone"
            dataKey="groundednessRate"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, fill: "#10b981", stroke: "var(--background)", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            isAnimationActive
          />
          <Line
            type="monotone"
            dataKey="declineRate"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: "#f59e0b", stroke: "var(--background)", strokeWidth: 1.5 }}
            activeDot={{ r: 5 }}
            isAnimationActive
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
