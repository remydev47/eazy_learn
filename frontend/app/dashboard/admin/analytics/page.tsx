"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Settings,
  Search,
  Bell,
  Globe,
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const userGrowthData = [
  { month: "May",  users: 3200 },
  { month: "Jun",  users: 4800 },
  { month: "Jul",  users: 6100 },
  { month: "Aug",  users: 7400 },
  { month: "Sep",  users: 9200 },
  { month: "Oct",  users: 12400 },
  { month: "Nov",  users: 15800 },
  { month: "Dec",  users: 19200 },
  { month: "Jan",  users: 22100 },
  { month: "Feb",  users: 28400 },
];

const BAR_COLORS = [
  "#FBCFBF","#F9B49A","#F79A76","#F47F52",
  "#F2652E","#D4541F","#B84515","#9F3B0F",
  "#FF510E","#E04209",
];

const pieData = [
  { name: "Technology",  value: 38, fill: "#FF510E" },
  { name: "Data Science",value: 24, fill: "#F47F52" },
  { name: "Design",      value: 18, fill: "#CBD5E1" },
  { name: "Business",    value: 13, fill: "#94a3b8" },
  { name: "Education",   value: 7,  fill: "#64748b" },
];

const topCategories = [
  { rank: 1, name: "Machine Learning Engineering",           enrolled: 3412, rating: 4.8, revenue: 41200 },
  { rank: 2, name: "Professional Career Development",        enrolled: 2810, rating: 4.9, revenue: 34200 },
  { rank: 3, name: "Advanced UI/UX Fundamentals",            enrolled: 1248, rating: 4.9, revenue: 12450 },
  { rank: 4, name: "Data-Driven Decision Making",            enrolled: 940,  rating: 4.7, revenue: 8700  },
  { rank: 5, name: "Cloud Architecture & DevOps",            enrolled: 388,  rating: 4.6, revenue: 3200  },
];

const topInstructors = [
  { name: "Dr. Elena Rossi",  initials: "ER", color: "bg-violet-500", students: 12482, rating: 4.92, earnings: 14290 },
  { name: "Prof. James Li",   initials: "JL", color: "bg-blue-500",   students: 8341,  rating: 4.88, earnings: 9820  },
  { name: "Marco Valerio",    initials: "MV", color: "bg-amber-500",  students: 6204,  rating: 4.85, earnings: 7610  },
];

const navItems = [
  { label: "Overview",          href: "/dashboard/admin",            icon: LayoutDashboard },
  { label: "Users",             href: "/dashboard/admin/users",      icon: Users },
  { label: "Course Management", href: "/dashboard/admin/courses",    icon: BookOpen },
  { label: "Payouts",           href: "/dashboard/admin/revenue",    icon: CreditCard },
  { label: "Settings",          href: "/dashboard/admin/settings",   icon: Settings },
];

export default function AdminAnalyticsPage() {
  const [instructorIndex, setInstructorIndex] = useState(0);

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="w-52 shrink-0 bg-white border-r border-slate-100 flex flex-col">
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-0.5 mb-1">
            <span className="text-xl font-bold text-slate-900">Eazy</span>
            <span className="text-xl font-bold text-[#FF510E]">Tech</span>
          </Link>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Academic Admin
          </p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mx-4 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-700">System Health: 100%</span>
          </div>
          <Progress value={100} className="h-1.5 [&>div]:bg-emerald-500" />
        </div>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">DH</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">Dean Henderson</p>
              <p className="text-xs text-slate-500 truncate">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Platform Performance</h1>
            <p className="text-xs text-slate-500 mt-0.5">Deep analytics across users, revenue and engagement</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Global Search..." className="pl-9 w-56 h-9 text-sm" />
            </div>
            <button className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">

          {/* Summary chips */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            {[
              { label: "Total Users",       value: "84,201",   icon: Users,       color: "text-blue-600"    },
              { label: "Total Revenue",     value: "$1.48M",   icon: TrendingUp,  color: "text-[#FF510E]"   },
              { label: "Avg Rating",        value: "4.82",     icon: Star,        color: "text-amber-500"   },
              { label: "Global Reach",      value: "62 countries", icon: Globe,   color: "text-emerald-600" },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">{card.label}</p>
                    <p className="text-xl font-bold text-slate-900">{card.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 2: User Growth + Revenue by Category */}
          <div className="grid grid-cols-3 gap-5 mb-8">
            {/* User Growth bar chart */}
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">User Growth</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Monthly active learners, May 2024 – Feb 2025</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">+193% YTD</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userGrowthData} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(v) => typeof v === "number" ? [`${v.toLocaleString()} users`, "Users"] : [String(v), "Users"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                  />
                  <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                    {userGrowthData.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Category donut */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-1">Revenue by Category</h3>
              <p className="text-xs text-slate-500 mb-4">Total $1.2M across all categories</p>
              <div className="flex justify-center mb-4">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.fill }} />
                      <span className="text-xs text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-800">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Top courses + Global Reach + Top Instructors */}
          <div className="grid grid-cols-3 gap-5">
            {/* Most Popular Courses */}
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Most Popular Courses</h3>
              </div>
              <div className="grid grid-cols-[40px_3fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
                {["#", "Course", "Enrolled", "Rating", "Revenue"].map((h) => (
                  <span key={h} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</span>
                ))}
              </div>
              {topCategories.map((course) => (
                <div
                  key={course.rank}
                  className="grid grid-cols-[40px_3fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50/60 transition-colors items-center"
                >
                  <span className="text-sm font-bold text-slate-400">#{course.rank}</span>
                  <p className="text-sm font-semibold text-slate-900 truncate">{course.name}</p>
                  <span className="text-sm text-slate-700">{course.enrolled.toLocaleString()}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-slate-800">{course.rating}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">${(course.revenue / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>

            {/* Top Earning Instructors carousel */}
            <div className="bg-slate-800 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Top Instructors</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setInstructorIndex((i) => Math.max(0, i - 1))}
                    disabled={instructorIndex === 0}
                    className="p-1 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-white" />
                  </button>
                  <button
                    onClick={() => setInstructorIndex((i) => Math.min(topInstructors.length - 1, i + 1))}
                    disabled={instructorIndex === topInstructors.length - 1}
                    className="p-1 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>

              {topInstructors.map((inst, i) => (
                <div
                  key={inst.name}
                  className={`transition-all duration-300 ${i === instructorIndex ? "block" : "hidden"} flex-1 flex flex-col`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full ${inst.color} flex items-center justify-center`}>
                      <span className="text-white text-sm font-bold">{inst.initials}</span>
                    </div>
                    <div>
                      <p className="text-white font-bold">{inst.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-amber-400 font-semibold">{inst.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="bg-slate-700 rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1">Total Students</p>
                      <p className="text-2xl font-bold text-white">{inst.students.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-700 rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1">Monthly Earnings</p>
                      <p className="text-2xl font-bold text-[#FF510E]">${inst.earnings.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-4 justify-center">
                    {topInstructors.map((_, j) => (
                      <div
                        key={j}
                        className={`h-1.5 rounded-full transition-all ${
                          j === instructorIndex ? "w-6 bg-[#FF510E]" : "w-1.5 bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
