"use client";

import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Users, BarChart2, DollarSign,
  Calendar, MessageSquare, Settings, HelpCircle, TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { StudentGrowthChart } from "@/components/dashboard/StudentGrowthChart";

const nav = [
  { label: "Dashboard",  href: "/dashboard/instructor",           icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/instructor/courses",   icon: BookOpen },
  { label: "Students",   href: "/dashboard/instructor/students",  icon: Users },
  { label: "Analytics",  href: "/dashboard/instructor/analytics", icon: BarChart2,      active: true },
  { label: "Revenue",    href: "/dashboard/instructor/revenue",   icon: DollarSign },
  { label: "Schedule",   href: "/dashboard/instructor/schedule",  icon: Calendar },
  { label: "Messages",   href: "/dashboard/instructor/messages",  icon: MessageSquare },
  { label: "Settings",   href: "/dashboard/instructor/settings",  icon: Settings },
  { label: "Help",       href: "/dashboard/instructor/help",      icon: HelpCircle },
];

const topCourses = [
  { title: "Advanced UI/UX Fundamentals",        enrolled: 1248, completion: 64, rating: 4.9 },
  { title: "Professional Career Development",    enrolled: 2810, completion: 78, rating: 4.9 },
  { title: "Data-Driven Decision Making",        enrolled: 940,  completion: 55, rating: 4.7 },
];

const retentionData = [
  { label: "Week 1", pct: 98 },
  { label: "Week 2", pct: 88 },
  { label: "Week 3", pct: 79 },
  { label: "Week 4", pct: 71 },
  { label: "Month 2", pct: 63 },
  { label: "Month 3", pct: 58 },
];

export default function InstructorAnalyticsPage() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-52 shrink-0 bg-white border-r border-slate-100 flex flex-col">
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-xl font-bold text-slate-900">Eazy</span>
            <span className="text-xl font-bold text-[#FF510E]">Tech</span>
          </Link>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Academic Portal</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active ? "bg-[#FF510E] text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">ER</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">Dr. Elena Rossi</p>
              <p className="text-xs text-slate-500">Instructor</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">Performance metrics across all your courses</p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Students",   value: "12,482", delta: "+8.2% this month", color: "text-slate-900"   },
              { label: "Avg Completion",   value: "68%",    delta: "+4% vs last month", color: "text-emerald-600" },
              { label: "Avg Rating",       value: "4.92",   delta: "Based on 4,500+ reviews", color: "text-amber-500" },
              { label: "Watch Time (hrs)", value: "48.2k",  delta: "+12% this week",   color: "text-[#FF510E]"   },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-xs text-slate-500 mb-1">{c.label}</p>
                <p className={`text-3xl font-bold ${c.color} mb-1`}>{c.value}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <p className="text-xs text-slate-400">{c.delta}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-2 gap-5 mb-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-1">Student Engagement</h3>
              <p className="text-xs text-slate-500 mb-4">Watch time & quiz activity over 30 days</p>
              <EngagementChart />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-1">Student Growth</h3>
              <p className="text-xs text-slate-500 mb-4">New enrollments — Direct vs Referred</p>
              <StudentGrowthChart />
            </div>
          </div>

          {/* Course breakdown + Retention */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">Top Performing Courses</h3>
              <div className="space-y-4">
                {topCourses.map((c) => (
                  <div key={c.title}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-800 truncate pr-4">{c.title}</span>
                      <span className="text-slate-500 shrink-0">{c.enrolled.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={c.completion} className="flex-1 h-2 [&>div]:bg-[#FF510E]" />
                      <span className="text-xs font-semibold text-slate-600 w-8 shrink-0">{c.completion}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">Student Retention</h3>
              <div className="space-y-3">
                {retentionData.map((r) => (
                  <div key={r.label} className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 w-16 shrink-0">{r.label}</span>
                    <Progress value={r.pct} className="flex-1 h-2 [&>div]:bg-blue-500" />
                    <span className="text-xs font-semibold text-slate-700 w-8 text-right shrink-0">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
