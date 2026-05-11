"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { week: "W1",  direct: 42,  referred: 18 },
  { week: "W2",  direct: 78,  referred: 30 },
  { week: "W3",  direct: 95,  referred: 42 },
  { week: "W4",  direct: 140, referred: 55 },
  { week: "W5",  direct: 110, referred: 48 },
  { week: "W6",  direct: 185, referred: 70 },
  { week: "W7",  direct: 130, referred: 52 },
  { week: "W8",  direct: 210, referred: 88 },
];

export function StudentGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={18} barGap={4} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="week"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
          cursor={{ fill: "rgba(0,0,0,0.03)" }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        <Bar dataKey="direct"   name="Direct"   fill="#B83310" radius={[3, 3, 0, 0]} />
        <Bar dataKey="referred" name="Referred"  fill="#CBD5E1" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
