"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart2,
  DollarSign,
  Bell,
  Plus,
  Star,
  UserCheck,
  MessageCircle,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EngagementChart } from "@/components/dashboard/EngagementChart";

/* ── Mock data ── */
const stats = [
  {
    label: "TOTAL STUDENTS",
    value: "12,482",
    badge: "+10k",
    icon: Users,
    iconBg: "bg-orange-100",
    iconColor: "text-[#FF510E]",
  },
  {
    label: "AVERAGE RATING",
    value: "4.92",
    badge: "Top 1%",
    icon: Star,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    label: "MONTHLY EARNINGS",
    value: "$14,290",
    badge: "Top 5%",
    icon: DollarSign,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

const recentActivity = [
  {
    icon: UserCheck,
    iconBg: "bg-[#FF510E]/10",
    iconColor: "text-[#FF510E]",
    text: (
      <>
        <span className="font-semibold">Marcus Chen</span> enrolled in{" "}
        <em>Advanced UI Design</em>
      </>
    ),
    time: "2 minutes ago",
  },
  {
    icon: Star,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    text: (
      <>
        New 5-star review from <span className="font-semibold">Sarah J.</span>
      </>
    ),
    time: "45 minutes ago",
  },
  {
    icon: MessageCircle,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    text: (
      <>
        New question in <em>UX Research</em>
      </>
    ),
    time: "2 hours ago",
  },
];

const courses = [
  {
    id: 1,
    title: "Mastering Modern Typography",
    tags: ["Design", "Intermediate"],
    enrolled: 4290,
    completion: 74,
    image: "/assets/less4.webp",
  },
  {
    id: 2,
    title: "Product Management Foundations",
    tags: ["Business", "Beginner"],
    enrolled: 8192,
    completion: 31,
    image: "/assets/less3.webp",
  },
];

const navItems = [
  { label: "Dashboard", href: "/dashboard/instructor", icon: LayoutDashboard, active: true },
  { label: "My Courses", href: "/dashboard/instructor/courses", icon: BookOpen },
  { label: "Students", href: "/dashboard/instructor/students", icon: Users },
  { label: "Analytics", href: "/dashboard/instructor/analytics", icon: BarChart2 },
  { label: "Revenue", href: "/dashboard/instructor/revenue", icon: DollarSign },
];

const periods = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "Last Year"];

export default function InstructorDashboardPage() {
  const [period, setPeriod] = useState("Last 30 Days");

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── Sidebar ── */}
      <aside className="w-52 shrink-0 bg-white border-r border-slate-100 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-xl font-bold text-slate-900">Eazy</span>
            <span className="text-xl font-bold text-[#FF510E]">Tech</span>
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-[#FF510E] text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">ER</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">Dr. Elena Rossi</p>
              <p className="text-xs text-slate-500 truncate">Senior Instructor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">

            {/* Page header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Instructor Overview</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Welcome back, Elena. Here&apos;s what&apos;s happening with your courses today.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <Bell className="w-4 h-4 text-slate-600" />
                </button>
                <Button className="bg-[#FF510E] hover:bg-orange-600 text-white font-semibold gap-2">
                  <Plus className="w-4 h-4" />
                  Create Course
                </Button>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${s.iconColor}`} />
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      {s.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Engagement + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Engagement chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Student Engagement</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Interactions and video watch-time over the selected period
                    </p>
                  </div>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#FF510E]/30"
                  >
                    {periods.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <EngagementChart />
                </div>
                <div className="flex gap-5 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-[#FF510E]" />
                    <span className="text-xs text-slate-500">Watch time</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-blue-500" />
                    <span className="text-xs text-slate-500">Quiz attempts</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
                <div className="space-y-5">
                  {recentActivity.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex gap-3">
                        <div
                          className={`w-8 h-8 ${item.iconBg} rounded-full flex items-center justify-center shrink-0`}
                        >
                          <Icon className={`w-4 h-4 ${item.iconColor}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-slate-700 leading-snug">{item.text}</p>
                          <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="mt-5 text-sm text-[#FF510E] font-medium hover:underline">
                  View all activity
                </button>
              </div>
            </div>

            {/* Your Courses */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Your Courses</h2>
                <Link
                  href="/dashboard/instructor/courses"
                  className="text-sm text-[#FF510E] font-medium hover:underline"
                >
                  Manage all courses →
                </Link>
              </div>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-5 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm mb-1">{course.title}</p>
                      <div className="flex gap-2">
                        {course.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-slate-500 mb-1">Enrolled</p>
                      <p className="text-sm font-bold text-slate-900">{course.enrolled.toLocaleString()}</p>
                    </div>
                    <div className="w-32 shrink-0">
                      <p className="text-xs text-slate-500 mb-1.5">Completion Rate</p>
                      <Progress value={course.completion} className="h-1.5 [&>div]:bg-[#FF510E]" />
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between gap-4 text-xs">
            <div>
              <p className="font-bold text-white mb-0.5">EazyTech</p>
              <p>Empowering instructors to deliver world-class education.</p>
            </div>
            <div className="flex gap-5 items-center">
              <Link href="#" className="hover:text-white transition-colors">Help Center</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Instructor Terms</Link>
              <span>© 2026 EazyTech. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
