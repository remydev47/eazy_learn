"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList,
  Award, MessageSquare, Settings, HelpCircle, Clock, CheckCircle2, AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const nav = [
  { label: "Dashboard",    href: "/dashboard/student",              icon: LayoutDashboard },
  { label: "My Courses",   href: "/dashboard/student/courses",      icon: BookOpen },
  { label: "Schedule",     href: "/dashboard/student/schedule",     icon: Calendar },
  { label: "Assignments",  href: "/dashboard/student/assignments",  icon: ClipboardList,  active: true },
  { label: "Certificates", href: "/dashboard/student/certificates", icon: Award },
  { label: "Messages",     href: "/dashboard/student/messages",     icon: MessageSquare },
  { label: "Settings",     href: "/dashboard/student/settings",     icon: Settings },
  { label: "Help",         href: "/dashboard/student/help",         icon: HelpCircle },
];

type Status = "pending" | "submitted" | "graded" | "overdue";

const assignments = [
  { id: 1, title: "User Research Report",       course: "Advanced UI/UX Fundamentals",      due: "Oct 29, 11:59 PM", status: "pending"   as Status, grade: null, points: 100 },
  { id: 2, title: "Data Pipeline Design",       course: "Data-Driven Decision Making",       due: "Oct 26, 11:59 PM", status: "submitted" as Status, grade: null, points: 80  },
  { id: 3, title: "Career Strategy Essay",      course: "Professional Career Development",   due: "Oct 22, 11:59 PM", status: "graded"    as Status, grade: 87,   points: 100 },
  { id: 4, title: "ML Model Evaluation",        course: "Machine Learning Engineering",      due: "Oct 20, 11:59 PM", status: "graded"    as Status, grade: 92,   points: 100 },
  { id: 5, title: "Prototype Wireframes",       course: "Advanced UI/UX Fundamentals",      due: "Oct 18, 11:59 PM", status: "overdue"   as Status, grade: null, points: 75  },
  { id: 6, title: "SQL Query Optimisation",     course: "Data-Driven Decision Making",       due: "Oct 15, 11:59 PM", status: "graded"    as Status, grade: 95,   points: 60  },
];

const statusConfig: Record<Status, { label: string; icon: React.ElementType; badge: string }> = {
  pending:   { label: "Pending",   icon: Clock,         badge: "bg-amber-50 text-amber-700"    },
  submitted: { label: "Submitted", icon: CheckCircle2,  badge: "bg-blue-50 text-blue-700"      },
  graded:    { label: "Graded",    icon: CheckCircle2,  badge: "bg-emerald-50 text-emerald-700"},
  overdue:   { label: "Overdue",   icon: AlertCircle,   badge: "bg-rose-50 text-rose-700"      },
};

const FILTERS: ("All" | Status)[] = ["All", "pending", "submitted", "graded", "overdue"];

export default function StudentAssignmentsPage() {
  const [filter, setFilter] = useState<"All" | Status>("All");

  const filtered = filter === "All" ? assignments : assignments.filter((a) => a.status === filter);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-52 shrink-0 bg-white border-r border-slate-100 flex flex-col">
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <Link href="/"><span className="text-xl font-bold text-[#FF510E]">EazyTech</span></Link>
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
        <div className="mx-4 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xs font-semibold text-slate-700 mb-2">System Health</p>
          <Progress value={100} className="h-1.5 [&>div]:bg-emerald-500" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-900">Assignments</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track your coursework deadlines and grades</p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">
          {/* Summary chips */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total",     value: assignments.length, color: "text-slate-900" },
              { label: "Pending",   value: assignments.filter((a) => a.status === "pending").length, color: "text-amber-600" },
              { label: "Submitted", value: assignments.filter((a) => a.status === "submitted").length, color: "text-blue-600" },
              { label: "Graded",    value: assignments.filter((a) => a.status === "graded").length, color: "text-emerald-600" },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-xs text-slate-500 mb-1">{c.label}</p>
                <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Filter tabs */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-1">
              {FILTERS.map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${
                    filter === f ? "bg-[#FF510E] text-white" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {f === "All" ? "All" : statusConfig[f as Status].label}
                </button>
              ))}
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[3fr_2fr_1fr_1fr_100px] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
              {["Assignment", "Course", "Due Date", "Points", "Status"].map((h) => (
                <span key={h} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</span>
              ))}
            </div>

            {filtered.map((a) => {
              const { label, icon: Icon, badge } = statusConfig[a.status];
              return (
                <div key={a.id} className="grid grid-cols-[3fr_2fr_1fr_1fr_100px] gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50/60 transition-colors items-center">
                  <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                  <p className="text-sm text-slate-500 truncate">{a.course}</p>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-600">{a.due}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {a.grade !== null ? `${a.grade}/${a.points}` : `—/${a.points}`}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${badge}`}>
                    <Icon className="w-3 h-3" />{label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
