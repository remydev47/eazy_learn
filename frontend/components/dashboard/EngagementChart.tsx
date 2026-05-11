"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Apr 1",  watch: 120, quizzes: 30, posts: 15 },
  { day: "Apr 5",  watch: 180, quizzes: 45, posts: 20 },
  { day: "Apr 10", watch: 145, quizzes: 35, posts: 18 },
  { day: "Apr 15", watch: 220, quizzes: 60, posts: 28 },
  { day: "Apr 20", watch: 195, quizzes: 50, posts: 22 },
  { day: "Apr 25", watch: 260, quizzes: 70, posts: 35 },
  { day: "Apr 30", watch: 310, quizzes: 80, posts: 40 },
];

export function EngagementChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="watchGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#FF510E" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#FF510E" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="quizGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          interval={1}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
        />
        <Area
          type="monotone"
          dataKey="watch"
          name="Watch time (min)"
          stroke="#FF510E"
          strokeWidth={2}
          fill="url(#watchGrad)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="quizzes"
          name="Quiz attempts"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#quizGrad)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
