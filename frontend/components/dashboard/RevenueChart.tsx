"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

const data = [
  { month: "Jun", revenue: 72000 },
  { month: "Jul", revenue: 95000 },
  { month: "Aug", revenue: 85000 },
  { month: "Sep", revenue: 118000 },
  { month: "Oct", revenue: 138000 },
  { month: "Nov", revenue: 162000 },
  { month: "Dec", revenue: 190000 },
  { month: "Jan", revenue: 175000 },
  { month: "Feb", revenue: 210000 },
  { month: "Mar", revenue: 198000 },
];

const COLORS = [
  "#FBCFBF", "#F9B49A", "#F79A76", "#F47F52",
  "#F2652E", "#D4541F", "#B84515", "#9F3B0F",
  "#FF510E", "#E04209",
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={36} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
        />
        <YAxis hide />
        <Tooltip
          formatter={(v) => typeof v === "number" ? [`$${(v / 1000).toFixed(0)}k`, "Revenue"] : [String(v), "Revenue"]}
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
        />
        <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
