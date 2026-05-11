"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Users, BarChart2, DollarSign,
  Calendar, MessageSquare, Settings, HelpCircle, Search, Star,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const nav = [
  { label: "Dashboard",  href: "/dashboard/instructor",           icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/instructor/courses",   icon: BookOpen },
  { label: "Students",   href: "/dashboard/instructor/students",  icon: Users,          active: true },
  { label: "Analytics",  href: "/dashboard/instructor/analytics", icon: BarChart2 },
  { label: "Revenue",    href: "/dashboard/instructor/revenue",   icon: DollarSign },
  { label: "Schedule",   href: "/dashboard/instructor/schedule",  icon: Calendar },
  { label: "Messages",   href: "/dashboard/instructor/messages",  icon: MessageSquare },
  { label: "Settings",   href: "/dashboard/instructor/settings",  icon: Settings },
  { label: "Help",       href: "/dashboard/instructor/help",      icon: HelpCircle },
];

const students = [
  { id: 1, initials: "JM", color: "bg-blue-500",    name: "Julianne Moore",   email: "jmoore@academia.edu",  course: "Advanced UI/UX Fundamentals", progress: 82, grade: "A",  lastSeen: "2h ago",   enrolled: "Sep 12, 2024" },
  { id: 2, initials: "RK", color: "bg-violet-500",  name: "Robert Kincaid",   email: "rkinc@protonmail.com", course: "Advanced UI/UX Fundamentals", progress: 47, grade: "B",  lastSeen: "1d ago",   enrolled: "Sep 15, 2024" },
  { id: 3, initials: "EL", color: "bg-rose-500",    name: "Elena Lopez",      email: "e.lopez@stanford.edu", course: "Data-Driven Decision Making",  progress: 91, grade: "A+", lastSeen: "3h ago",   enrolled: "Aug 20, 2024" },
  { id: 4, initials: "DW", color: "bg-teal-500",    name: "David Wei",        email: "dwei@gmail.com",       course: "Advanced UI/UX Fundamentals", progress: 65, grade: "B+", lastSeen: "5h ago",   enrolled: "Oct 01, 2024" },
  { id: 5, initials: "PN", color: "bg-amber-500",   name: "Pavel Ostrovsky",  email: "p.ostrov@ru.edu",      course: "Data-Driven Decision Making",  progress: 23, grade: "C",  lastSeen: "4d ago",   enrolled: "Oct 10, 2024" },
  { id: 6, initials: "FN", color: "bg-emerald-500", name: "Fatima Ndiaye",    email: "f.ndiaye@univ.fr",     course: "Advanced UI/UX Fundamentals", progress: 100, grade: "A+", lastSeen: "Just now", enrolled: "Aug 01, 2024" },
];

const gradeBadge: Record<string, string> = {
  "A+": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "A":  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "B+": "bg-blue-50 text-blue-700 border-blue-200",
  "B":  "bg-blue-50 text-blue-700 border-blue-200",
  "C":  "bg-amber-50 text-amber-700 border-amber-200",
};

export default function InstructorStudentsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() =>
    students.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase())
    ), [search]);

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
              <p className="text-xs text-slate-500 truncate">Instructor</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Students</h1>
            <p className="text-xs text-slate-500 mt-0.5">{students.length} enrolled across all courses</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Search students…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 h-9 text-sm border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">
          {/* Stat row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Students",  value: students.length,                                             color: "text-slate-900"   },
              { label: "Avg Progress",    value: `${Math.round(students.reduce((s,u)=>s+u.progress,0)/students.length)}%`, color: "text-[#FF510E]" },
              { label: "Completed",       value: students.filter((s) => s.progress === 100).length,            color: "text-emerald-600" },
              { label: "At Risk (<40%)",  value: students.filter((s) => s.progress < 40).length,               color: "text-rose-600"    },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-xs text-slate-500 mb-1">{c.label}</p>
                <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr_80px] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
              {["Student", "Course", "Progress", "Grade", ""].map((h) => (
                <span key={h} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</span>
              ))}
            </div>
            {filtered.map((s) => (
              <div key={s.id} className="grid grid-cols-[2fr_2fr_1fr_1fr_80px] gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50/60 transition-colors items-center">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-xs font-bold">{s.initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{s.name}</p>
                    <p className="text-xs text-slate-500 truncate">{s.lastSeen}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 truncate">{s.course}</p>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{s.progress}%</span>
                  </div>
                  <Progress value={s.progress} className="h-1.5 [&>div]:bg-[#FF510E]" />
                </div>
                <Badge variant="outline" className={`text-xs font-bold w-fit ${gradeBadge[s.grade]}`}>{s.grade}</Badge>
                <button className="text-xs font-semibold text-[#FF510E] hover:underline">Message</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
