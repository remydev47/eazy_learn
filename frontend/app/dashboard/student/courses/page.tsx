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
  LayoutGrid,
  List,
  ChevronDown,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

/* ── Data ── */
const DISCIPLINES = ["All Disciplines", "Computer Science", "UX Design", "Data Analytics", "Business"];
const STATUSES = ["All Status", "In Progress", "Completed", "Not Started"];
const INSTRUCTORS = ["All Instructors", "Dr. Elena Vance", "Prof. Marcus Thorne", "Sarah Jenkins"];

const courses = [
  {
    id: 1,
    title: "Advanced Neural Networks & Deep Learning",
    instructor: { name: "Dr. Elena Vance", initials: "EV", color: "bg-blue-500" },
    category: "COMPUTER SCIENCE",
    discipline: "Computer Science",
    progress: 65,
    status: "In Progress",
    image: "/assets/less2.webp",
    moodleId: 1,
  },
  {
    id: 2,
    title: "Human-Centered Design Principles",
    instructor: { name: "Prof. Marcus Thorne", initials: "MT", color: "bg-violet-500" },
    category: "UX DESIGN",
    discipline: "UX Design",
    progress: 28,
    status: "In Progress",
    image: "/assets/less4.webp",
    moodleId: 2,
  },
  {
    id: 3,
    title: "Financial Analytics & Risk Modeling",
    instructor: { name: "Sarah Jenkins", initials: "SJ", color: "bg-emerald-500" },
    category: "DATA ANALYTICS",
    discipline: "Data Analytics",
    progress: 89,
    status: "In Progress",
    image: "/assets/less5.avif",
    moodleId: 3,
  },
  {
    id: 4,
    title: "Quantum Computing Fundamentals",
    instructor: { name: "Dr. Elena Vance", initials: "EV", color: "bg-blue-500" },
    category: "COMPUTER SCIENCE",
    discipline: "Computer Science",
    progress: 12,
    status: "In Progress",
    image: "/assets/hero.png",
    moodleId: 4,
  },
  {
    id: 5,
    title: "UX Research Methods & Usability Testing",
    instructor: { name: "Prof. Marcus Thorne", initials: "MT", color: "bg-violet-500" },
    category: "UX DESIGN",
    discipline: "UX Design",
    progress: 54,
    status: "In Progress",
    image: "/assets/less3.webp",
    moodleId: 5,
  },
  {
    id: 6,
    title: "Business Intelligence & Data Visualization",
    instructor: { name: "Sarah Jenkins", initials: "SJ", color: "bg-emerald-500" },
    category: "DATA ANALYTICS",
    discipline: "Data Analytics",
    progress: 100,
    status: "Completed",
    image: "/assets/less6.avif",
    moodleId: 6,
  },
];

const sideNavPrimary = [
  { label: "Dashboard",  href: "/dashboard/student",         icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/student/courses", icon: BookOpen, active: true },
  { label: "Schedule",   href: "/dashboard/student/schedule", icon: Calendar },
  { label: "Messages",   href: "/dashboard/student/messages", icon: MessageSquare },
];

const sideNavSecondary = [
  { label: "Settings", href: "/dashboard/student/settings", icon: Settings },
  { label: "Help",     href: "/dashboard/student/help",     icon: HelpCircle },
];

const topTabs = [
  { label: "Overview",   href: "/dashboard/student" },
  { label: "My Courses", href: "/dashboard/student/courses", active: true },
  { label: "Resources",  href: "/resources" },
];

export default function MyCoursesPage() {
  const [search,     setSearch]     = useState("");
  const [discipline, setDiscipline] = useState("All Disciplines");
  const [status,     setStatus]     = useState("All Status");
  const [instructor, setInstructor] = useState("All Instructors");
  const [viewMode,   setViewMode]   = useState<"grid" | "list">("grid");

  const moodleUrl = process.env.NEXT_PUBLIC_MOODLE_URL ?? "#";

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch     = !search     || c.title.toLowerCase().includes(search.toLowerCase());
      const matchDiscipline = discipline === "All Disciplines" || c.discipline === discipline;
      const matchStatus     = status     === "All Status"      || c.status     === status;
      const matchInstructor = instructor === "All Instructors" || c.instructor.name === instructor;
      return matchSearch && matchDiscipline && matchStatus && matchInstructor;
    });
  }, [search, discipline, status, instructor]);

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="w-52 shrink-0 bg-white border-r border-slate-100 flex flex-col">

        {/* Brand */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <Link href="/">
            <span className="text-xl font-bold text-[#FF510E]">EazyTech</span>
          </Link>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
            Academic Portal
          </p>
        </div>

        {/* Primary nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {sideNavPrimary.map((item) => {
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

        {/* Secondary nav */}
        <div className="px-3 pb-3 space-y-0.5">
          {sideNavSecondary.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Upgrade promo */}
        <div className="mx-3 mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-600 mb-2.5 font-medium">Need more space?</p>
          <button className="w-full bg-[#FF510E] hover:bg-orange-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Secondary top nav */}
        <div className="bg-white border-b border-slate-100 px-6 flex items-center justify-between h-14 shrink-0">
          <nav className="flex items-center gap-7 h-full">
            {topTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`text-sm font-medium h-full flex items-center border-b-2 transition-colors ${
                  tab.active
                    ? "text-[#FF510E] border-[#FF510E]"
                    : "text-slate-500 border-transparent hover:text-slate-800"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {/* Global search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-8 pr-3 h-8 text-sm bg-slate-50 border border-slate-200 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20 focus:border-[#FF510E]/50"
              />
            </div>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4 text-slate-500" />
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <HelpCircle className="w-4 h-4 text-slate-500" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#FF510E] flex items-center justify-center">
              <span className="text-white text-xs font-bold">AL</span>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-7">

          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
              <p className="text-slate-500 text-sm mt-1.5">
                You are currently enrolled in{" "}
                <span className="font-semibold text-[#FF510E]">12 active courses</span>{" "}
                across 4 disciplines.
              </p>
            </div>

            {/* Grid / List toggle */}
            <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "grid" ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-l border-slate-200 transition-colors ${
                  viewMode === "list" ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-7 grid grid-cols-4 gap-5 shadow-sm">
            {/* Search filter */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="By name or ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20 focus:border-[#FF510E]/50"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20 focus:border-[#FF510E]/50"
                >
                  {DISCIPLINES.map((d) => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20 focus:border-[#FF510E]/50"
                >
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Instructor
              </label>
              <div className="relative">
                <select
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20 focus:border-[#FF510E]/50"
                >
                  {INSTRUCTORS.map((i) => <option key={i}>{i}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Course grid */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-3 gap-5">
              {filtered.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 bg-[#FF510E] text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-widest uppercase">
                      {course.category}
                    </span>
                    {course.progress === 100 && (
                      <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        ✓ Done
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 text-[15px] leading-snug mb-2.5 line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Instructor row */}
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className={`w-6 h-6 ${course.instructor.color} rounded-full flex items-center justify-center shrink-0`}
                      >
                        <span className="text-white text-[10px] font-bold">{course.instructor.initials}</span>
                      </div>
                      <span className="text-sm text-slate-500">{course.instructor.name}</span>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500 font-medium">Course Progress</span>
                        <span className="font-bold text-[#FF510E]">{course.progress}%</span>
                      </div>
                      <Progress
                        value={course.progress}
                        className="h-1.5 bg-slate-100 [&>div]:bg-[#FF510E]"
                      />
                    </div>

                    {/* CTA */}
                    <a
                      href={`${moodleUrl}/course/view.php?id=${course.moodleId}`}
                      className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      Go to Course
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}

              {/* Explore Catalog card */}
              <Link
                href="/courses"
                className="bg-white rounded-2xl border-2 border-dashed border-[#FF510E]/25 hover:border-[#FF510E]/60 transition-colors flex flex-col items-center justify-center p-8 text-center min-h-[300px] group"
              >
                <div className="w-14 h-14 bg-[#FF510E]/10 group-hover:bg-[#FF510E]/20 rounded-full flex items-center justify-center mb-4 transition-colors">
                  <Plus className="w-7 h-7 text-[#FF510E]" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Explore Catalog</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[180px]">
                  Find your next learning adventure in our extensive library.
                </p>
              </Link>
            </div>
          ) : (
            /* List view */
            <div className="space-y-3">
              {filtered.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-5 hover:shadow-sm transition-shadow"
                >
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0">
                    <Image src={course.image} alt={course.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#FF510E] uppercase tracking-wider">
                      {course.category}
                    </span>
                    <p className="font-semibold text-slate-900 mt-0.5 truncate">{course.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{course.instructor.name}</p>
                  </div>
                  <div className="w-36 shrink-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-bold text-[#FF510E]">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-1.5 bg-slate-100 [&>div]:bg-[#FF510E]" />
                  </div>
                  <a
                    href={`${moodleUrl}/course/view.php?id=${course.moodleId}`}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
                  >
                    Go to Course
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg font-medium">No courses match your filters.</p>
              <button
                onClick={() => { setSearch(""); setDiscipline("All Disciplines"); setStatus("All Status"); setInstructor("All Instructors"); }}
                className="mt-3 text-sm text-[#FF510E] hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
