import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import type { RetrievalFailureCategory } from "@/lib/demo/s27-demo-data";

interface FailuresBarChartProps {
  data: RetrievalFailureCategory[];
}

const COLORS = ["#f43f5e", "#f59e0b", "#3b82f6", "#8b5cf6"];
const tickStyle = { fill: "var(--muted-foreground)", fontSize: 10 };

export function FailuresBarChart({ data }: FailuresBarChartProps) {
  const chartData = data.map((d) => ({
    name: d.category.length > 24 ? `${d.category.slice(0, 22)}...` : d.category,
    fullName: d.category,
    count: d.count,
    percentage: d.percentage,
    remedy: d.remedyAction,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 16, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} strokeOpacity={0.5} />
          <XAxis type="number" tick={tickStyle} axisLine={{ stroke: "var(--border)" }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={tickStyle}
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="p-3 rounded-lg border border-border bg-popover text-popover-foreground text-xs shadow-md max-w-xs">
                    <span className="font-bold block mb-1">{item.fullName}</span>
                    <span className="text-muted-foreground block font-mono">
                      Failures: <strong>{item.count} queries</strong> ({item.percentage}%)
                    </span>
                    <span className="text-2xs text-primary block mt-1 font-medium">
                      Remedy: {item.remedy}
                    </span>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} isAnimationActive>
            {chartData.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
