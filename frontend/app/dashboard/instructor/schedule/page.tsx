"use client";

import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Users, BarChart2, DollarSign,
  Calendar, MessageSquare, Settings, HelpCircle, Plus,
} from "lucide-react";

const nav = [
  { label: "Dashboard",  href: "/dashboard/instructor",           icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/instructor/courses",   icon: BookOpen },
  { label: "Students",   href: "/dashboard/instructor/students",  icon: Users },
  { label: "Analytics",  href: "/dashboard/instructor/analytics", icon: BarChart2 },
  { label: "Revenue",    href: "/dashboard/instructor/revenue",   icon: DollarSign },
  { label: "Schedule",   href: "/dashboard/instructor/schedule",  icon: Calendar,       active: true },
  { label: "Messages",   href: "/dashboard/instructor/messages",  icon: MessageSquare },
  { label: "Settings",   href: "/dashboard/instructor/settings",  icon: Settings },
  { label: "Help",       href: "/dashboard/instructor/help",      icon: HelpCircle },
];

const events = [
  { day: "Mon", date: "Oct 28", time: "10:00 AM", title: "Live Q&A — UI/UX Fundamentals",      students: 84,  type: "Live Session", color: "bg-[#FF510E]" },
  { day: "Tue", date: "Oct 29", time: "11:59 PM", title: "Assignment deadline — Unit 4",        students: 248, type: "Deadline",     color: "bg-rose-500"  },
  { day: "Wed", date: "Oct 30", time: "2:00 PM",  title: "Office Hours — Career Development",   students: 12,  type: "Office Hours", color: "bg-emerald-500" },
  { day: "Thu", date: "Oct 31", time: "3:00 PM",  title: "Video upload — Module 7 recording",   students: 0,   type: "Task",         color: "bg-slate-400" },
  { day: "Fri", date: "Nov 1",  title: "Peer review period ends", time: "11:59 PM",             students: 156, type: "Deadline",     color: "bg-rose-500"  },
];

const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours  = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"];

export default function InstructorSchedulePage() {
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
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Schedule</h1>
            <p className="text-xs text-slate-500 mt-0.5">Week of Oct 28 – Nov 3, 2024</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">← Prev</button>
            <button className="px-4 py-2 text-sm bg-[#FF510E] text-white rounded-lg hover:bg-orange-600 transition-colors">This week</button>
            <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Next →</button>
            <button className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors ml-2">
              <Plus className="w-3.5 h-3.5" />Add Event
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-8 border-b border-slate-100">
                <div className="p-3 border-r border-slate-100" />
                {weeks.map((d) => (
                  <div key={d} className="p-3 text-center border-r border-slate-100 last:border-0">
                    <p className="text-xs font-semibold text-slate-500">{d}</p>
                  </div>
                ))}
              </div>
              {hours.map((h) => (
                <div key={h} className="grid grid-cols-8 border-b border-slate-50 last:border-0">
                  <div className="p-2 pr-3 text-right text-xs text-slate-400 border-r border-slate-100 pt-3">{h}</div>
                  {weeks.map((d) => {
                    const hasEvent =
                      (h === "10 AM" && d === "Mon") ||
                      (h === "2 PM"  && d === "Wed");
                    return (
                      <div key={d} className="border-r border-slate-50 last:border-0 h-12 relative">
                        {hasEvent && (
                          <div className="absolute inset-1 rounded-md bg-[#FF510E]/10 border border-[#FF510E]/30 flex items-center px-1.5">
                            <span className="text-[10px] font-semibold text-[#FF510E] truncate">Session</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">This week</h3>
              <div className="space-y-3">
                {events.map((ev) => (
                  <div key={ev.title} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-1.5 h-1.5 rounded-full ${ev.color} shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">{ev.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{ev.day} {ev.date} · {ev.time}</p>
                      {ev.students > 0 && (
                        <p className="text-xs text-slate-400 mt-0.5">{ev.students} students</p>
                      )}
                    </div>
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
