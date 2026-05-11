"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Plus,
  MoreHorizontal,
  ChevronDown,
  SlidersHorizontal,
  ArrowRight,
  Pencil,
  CreditCard,
  Star,
} from "lucide-react";
import { StudentGrowthChart } from "@/components/dashboard/StudentGrowthChart";

/* ── Types ── */
type CourseStatus = "Published" | "Draft" | "Archived";
type SortKey = "Most Enrolled" | "Completion" | "Revenue" | "Newest";

/* ── Mock data ── */
const allCourses: {
  id: number;
  title: string;
  status: CourseStatus;
  image: string;
  enrolled: number;
  completion: number;
  revenue: number | null;
}[] = [
  {
    id: 1,
    title: "Advanced UI/UX Fundamentals: Digital Systems",
    status: "Published",
    image: "/assets/less2.webp",
    enrolled: 1248,
    completion: 64,
    revenue: 12450,
  },
  {
    id: 2,
    title: "Mastering Educational Pedagogy & Design",
    status: "Draft",
    image: "/assets/hero.png",
    enrolled: 0,
    completion: 0,
    revenue: null,
  },
  {
    id: 3,
    title: "Professional Career Development for Creatives",
    status: "Published",
    image: "/assets/less4.webp",
    enrolled: 2810,
    completion: 78,
    revenue: 34200,
  },
  {
    id: 4,
    title: "Data-Driven Decision Making",
    status: "Published",
    image: "/assets/less3.webp",
    enrolled: 940,
    completion: 55,
    revenue: 8700,
  },
  {
    id: 5,
    title: "Instructional Design Fundamentals",
    status: "Draft",
    image: "/assets/less5.avif",
    enrolled: 0,
    completion: 0,
    revenue: null,
  },
  {
    id: 6,
    title: "Advanced Workshop Facilitation",
    status: "Archived",
    image: "/assets/less6.avif",
    enrolled: 388,
    completion: 91,
    revenue: 3200,
  },
];

const TABS: ("All Courses" | CourseStatus)[] = ["All Courses", "Published", "Draft", "Archived"];
const SORTS: SortKey[] = ["Most Enrolled", "Completion", "Revenue", "Newest"];

const sideNav = [
  { label: "Dashboard",  href: "/dashboard/instructor",         icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/instructor/courses", icon: BookOpen, active: true },
  { label: "Schedule",   href: "/dashboard/instructor/schedule", icon: Calendar },
  { label: "Messages",   href: "/dashboard/instructor/messages", icon: MessageSquare },
  { label: "Settings",   href: "/dashboard/instructor/settings", icon: Settings },
  { label: "Help",       href: "/dashboard/instructor/help",     icon: HelpCircle },
];

const statusBadge: Record<CourseStatus, { label: string; cls: string }> = {
  Published: { label: "Published", cls: "bg-emerald-500 text-white" },
  Draft:     { label: "Draft",     cls: "bg-slate-400 text-white" },
  Archived:  { label: "Archived",  cls: "bg-slate-600 text-white" },
};

export default function InstructorCoursesPage() {
  const [activeTab, setActiveTab] = useState<"All Courses" | CourseStatus>("All Courses");
  const [sortKey, setSortKey]     = useState<SortKey>("Most Enrolled");

  const filtered = useMemo(() => {
    let list = activeTab === "All Courses"
      ? allCourses
      : allCourses.filter((c) => c.status === activeTab);

    if (sortKey === "Most Enrolled") list = [...list].sort((a, b) => b.enrolled - a.enrolled);
    if (sortKey === "Completion")    list = [...list].sort((a, b) => b.completion - a.completion);
    if (sortKey === "Revenue")       list = [...list].sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0));

    return list;
  }, [activeTab, sortKey]);

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="w-52 shrink-0 bg-white border-r border-slate-100 flex flex-col">
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <Link href="/">
            <span className="text-xl font-bold text-[#FF510E]">EazyTech</span>
          </Link>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
            Academic Portal
          </p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {sideNav.map((item) => {
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

        {/* Upgrade button */}
        <div className="p-4 border-t border-slate-100">
          <button className="w-full bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="bg-white border-b border-slate-100 px-6 flex items-center justify-between h-14 shrink-0">
          <Link href="/dashboard/instructor" className="text-base font-bold text-[#FF510E]">
            EazyTech
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-8 pr-3 h-8 text-sm bg-slate-50 border border-slate-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20 focus:border-[#FF510E]/50"
              />
            </div>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4 text-slate-500" />
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <HelpCircle className="w-4 h-4 text-slate-500" />
            </button>
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">ER</span>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 py-7">

          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage your academic content and student engagement.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 bg-[#FF510E] hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              Create New Course
            </button>
          </div>

          {/* Tabs + Sort/Filter row */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-[#FF510E] text-white"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white text-sm text-slate-700">
                <span className="text-slate-500 text-xs">Sort by:</span>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="appearance-none bg-transparent font-medium focus:outline-none pr-4 text-sm"
                >
                  {SORTS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 -ml-3 pointer-events-none" />
              </div>
              <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-b border-slate-200 mb-6" />

          {/* Course cards */}
          <div className="grid grid-cols-3 gap-5 mb-12">
            {filtered.map((course) => {
              const badge = statusBadge[course.status];
              const isPublished = course.status === "Published";
              const isDraft     = course.status === "Draft";

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    {/* Status badge */}
                    <span
                      className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                    {/* More menu */}
                    <button className="absolute top-3 right-3 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 text-[15px] leading-snug mb-4 line-clamp-2 min-h-[44px]">
                      {course.title}
                    </h3>

                    {/* Stat chips */}
                    <div className="flex gap-3 mb-4">
                      <div
                        className={`flex-1 bg-slate-50 rounded-lg px-3 py-2.5 ${isDraft ? "opacity-50" : ""}`}
                      >
                        <p className="text-[10px] text-slate-500 mb-0.5">Enrolled</p>
                        <p className="text-xl font-bold text-slate-900">
                          {course.enrolled.toLocaleString()}
                        </p>
                      </div>
                      <div
                        className={`flex-1 bg-slate-50 rounded-lg px-3 py-2.5 ${isDraft ? "opacity-50" : ""}`}
                      >
                        <p className="text-[10px] text-slate-500 mb-0.5">Completion</p>
                        <p className="text-xl font-bold text-slate-900">{course.completion}%</p>
                      </div>
                    </div>

                    {/* Bottom action row */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      {isPublished ? (
                        <>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span className="text-sm font-semibold">
                              ${course.revenue?.toLocaleString()}.00
                            </span>
                          </div>
                          <button className="flex items-center gap-1 text-sm font-semibold text-[#FF510E] hover:underline">
                            Manage Content
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : isDraft ? (
                        <>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Pencil className="w-3.5 h-3.5" />
                            <span className="text-sm">Work in progress</span>
                          </div>
                          <button className="flex items-center gap-1 text-sm font-semibold text-[#FF510E] hover:underline">
                            Edit Draft
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-slate-400">Archived course</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance Overview */}
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Performance Overview</h2>

          <div className="grid grid-cols-3 gap-5">
            {/* Student Growth chart — 2 cols */}
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Student Growth</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Unique enrollments over the last 30 days
                  </p>
                </div>
              </div>
              <StudentGrowthChart />
            </div>

            {/* Instructor Rating card — 1 col */}
            <div className="bg-slate-700 rounded-2xl p-6 flex flex-col">
              <div className="mb-4">
                <Star className="w-7 h-7 text-[#FF510E] fill-[#FF510E]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instructor Rating</h3>
              <p className="text-sm text-slate-400 leading-relaxed flex-1">
                Based on 4,500+ student reviews across all published courses.
              </p>
              <div className="mt-6">
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-5xl font-bold text-white">4.9</span>
                  <span className="text-slate-400 text-sm font-medium">/ 5.0</span>
                </div>
                <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF510E] rounded-full"
                    style={{ width: "98%" }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
