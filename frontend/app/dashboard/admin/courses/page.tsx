"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Settings,
  Search,
  Bell,
  Plus,
  ChevronDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Star,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

/* ── Types ── */
type CourseStatus = "Published" | "Draft" | "Under Review" | "Archived";
type Category = "All" | "Technology" | "Design" | "Business" | "Data Science" | "Education";

/* ── Mock data ── */
const courses = [
  {
    id: 1,
    title: "Advanced UI/UX Fundamentals: Digital Systems",
    instructor: "Dr. Elena Rossi",
    instructorInitials: "ER",
    instructorColor: "bg-violet-500",
    category: "Design",
    status: "Published" as CourseStatus,
    enrolled: 1248,
    completion: 64,
    rating: 4.9,
    revenue: 12450,
    image: "/assets/less2.webp",
    updated: "Oct 20, 2024",
  },
  {
    id: 2,
    title: "Machine Learning Engineering",
    instructor: "Prof. James Li",
    instructorInitials: "JL",
    instructorColor: "bg-blue-500",
    category: "Technology",
    status: "Published" as CourseStatus,
    enrolled: 3412,
    completion: 72,
    rating: 4.8,
    revenue: 41200,
    image: "/assets/less3.webp",
    updated: "Oct 18, 2024",
  },
  {
    id: 3,
    title: "Data-Driven Decision Making",
    instructor: "Anya Petrova",
    instructorInitials: "AP",
    instructorColor: "bg-emerald-500",
    category: "Data Science",
    status: "Published" as CourseStatus,
    enrolled: 940,
    completion: 55,
    rating: 4.7,
    revenue: 8700,
    image: "/assets/less4.webp",
    updated: "Oct 15, 2024",
  },
  {
    id: 4,
    title: "Professional Career Development for Creatives",
    instructor: "Marco Valerio",
    instructorInitials: "MV",
    instructorColor: "bg-amber-500",
    category: "Business",
    status: "Published" as CourseStatus,
    enrolled: 2810,
    completion: 78,
    rating: 4.9,
    revenue: 34200,
    image: "/assets/less5.avif",
    updated: "Oct 12, 2024",
  },
  {
    id: 5,
    title: "Mastering Educational Pedagogy & Design",
    instructor: "Dr. Sarah Chen",
    instructorInitials: "SC",
    instructorColor: "bg-rose-500",
    category: "Education",
    status: "Under Review" as CourseStatus,
    enrolled: 0,
    completion: 0,
    rating: 0,
    revenue: 0,
    image: "/assets/hero.png",
    updated: "Oct 22, 2024",
  },
  {
    id: 6,
    title: "Advanced Workshop Facilitation",
    instructor: "Lena Müller",
    instructorInitials: "LM",
    instructorColor: "bg-teal-500",
    category: "Education",
    status: "Archived" as CourseStatus,
    enrolled: 388,
    completion: 91,
    rating: 4.6,
    revenue: 3200,
    image: "/assets/less6.avif",
    updated: "Sep 30, 2024",
  },
  {
    id: 7,
    title: "Cloud Architecture & DevOps Fundamentals",
    instructor: "Kevin Okafor",
    instructorInitials: "KO",
    instructorColor: "bg-indigo-500",
    category: "Technology",
    status: "Draft" as CourseStatus,
    enrolled: 0,
    completion: 0,
    rating: 0,
    revenue: 0,
    image: "/assets/less2.webp",
    updated: "Oct 23, 2024",
  },
];

const CATEGORIES: Category[] = ["All", "Technology", "Design", "Business", "Data Science", "Education"];
const STATUSES: ("All" | CourseStatus)[] = ["All", "Published", "Draft", "Under Review", "Archived"];

const navItems = [
  { label: "Overview",          href: "/dashboard/admin",          icon: LayoutDashboard },
  { label: "Users",             href: "/dashboard/admin/users",    icon: Users },
  { label: "Course Management", href: "/dashboard/admin/courses",  icon: BookOpen, active: true },
  { label: "Payouts",           href: "/dashboard/admin/revenue",  icon: CreditCard },
  { label: "Settings",          href: "/dashboard/admin/settings", icon: Settings },
];

const statusStyles: Record<CourseStatus, string> = {
  Published:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Draft:        "bg-slate-100 text-slate-600 border-slate-200",
  "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
  Archived:     "bg-rose-50 text-rose-700 border-rose-200",
};

const PAGE_SIZE = 5;

export default function AdminCoursesPage() {
  const [category, setCategory] = useState<Category>("All");
  const [status, setStatus]     = useState<"All" | CourseStatus>("All");
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchCat    = category === "All" || c.category === category;
      const matchStatus = status   === "All" || c.status   === status;
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.instructor.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchStatus && matchSearch;
    });
  }, [category, status, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statCards = [
    { label: "Total Courses",    value: "1,284", delta: "+48 this month",  color: "text-[#FF510E]" },
    { label: "Published",        value: "1,092", delta: "85% of total",    color: "text-emerald-600" },
    { label: "Total Enrollments",value: "48.2k", delta: "+1.2k this week", color: "text-blue-600" },
    { label: "Avg Rating",       value: "4.82",  delta: "↑ 0.04 vs last month", color: "text-amber-600" },
  ];

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
            <h1 className="text-xl font-bold text-slate-900">Course Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Global oversight of all platform courses</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 w-56 h-9 text-sm"
              />
            </div>
            <button className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            {statCards.map((card) => (
              <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-medium text-slate-500 mb-2">{card.label}</p>
                <p className={`text-3xl font-bold ${card.color} mb-1`}>{card.value}</p>
                <p className="text-xs text-slate-400">{card.delta}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      category === cat
                        ? "bg-[#FF510E] text-white"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-sm">
                  <span className="text-slate-400 text-xs">Status:</span>
                  <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value as "All" | CourseStatus); setPage(1); }}
                    className="appearance-none bg-transparent font-medium focus:outline-none pr-4 text-sm"
                  >
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 -ml-3 pointer-events-none" />
                </div>
                <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                </button>
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
              {["Course", "Category", "Status", "Enrolled", "Rating", ""].map((h) => (
                <span key={h} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</span>
              ))}
            </div>

            {/* Table rows */}
            {paginated.map((course) => (
              <div
                key={course.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50/60 transition-colors items-center"
              >
                {/* Course */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-9 rounded-lg overflow-hidden shrink-0">
                    <Image src={course.image} alt={course.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{course.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`w-4 h-4 rounded-full ${course.instructorColor} flex items-center justify-center`}>
                        <span className="text-white text-[8px] font-bold">{course.instructorInitials}</span>
                      </div>
                      <span className="text-xs text-slate-500 truncate">{course.instructor}</span>
                    </div>
                  </div>
                </div>
                {/* Category */}
                <span className="text-sm text-slate-600">{course.category}</span>
                {/* Status */}
                <Badge variant="outline" className={`text-xs font-semibold w-fit ${statusStyles[course.status]}`}>
                  {course.status}
                </Badge>
                {/* Enrolled */}
                <div>
                  <span className="text-sm font-semibold text-slate-900">{course.enrolled.toLocaleString()}</span>
                  {course.completion > 0 && (
                    <div className="mt-1">
                      <Progress value={course.completion} className="h-1 [&>div]:bg-[#FF510E]" />
                    </div>
                  )}
                </div>
                {/* Rating */}
                {course.rating > 0 ? (
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-slate-800">{course.rating}</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
                {/* Actions */}
                <div className="flex items-center gap-1 justify-end">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} courses
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      page === p ? "bg-[#FF510E] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#FF510E] hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-20">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
