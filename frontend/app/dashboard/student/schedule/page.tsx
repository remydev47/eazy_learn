"use client";

import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList,
  Award, MessageSquare, Settings, HelpCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const nav = [
  { label: "Dashboard",    href: "/dashboard/student",              icon: LayoutDashboard },
  { label: "My Courses",   href: "/dashboard/student/courses",      icon: BookOpen },
  { label: "Schedule",     href: "/dashboard/student/schedule",     icon: Calendar,       active: true },
  { label: "Assignments",  href: "/dashboard/student/assignments",  icon: ClipboardList },
  { label: "Certificates", href: "/dashboard/student/certificates", icon: Award },
  { label: "Messages",     href: "/dashboard/student/messages",     icon: MessageSquare },
  { label: "Settings",     href: "/dashboard/student/settings",     icon: Settings },
  { label: "Help",         href: "/dashboard/student/help",         icon: HelpCircle },
];

const upcoming = [
  { day: "Mon", date: "Oct 28", time: "10:00 AM", title: "Live Q&A — UI/UX Fundamentals", type: "Live Session", color: "bg-[#FF510E]" },
  { day: "Tue", date: "Oct 29", time: "11:59 PM", title: "Assignment: User Research Report", type: "Deadline", color: "bg-rose-500" },
  { day: "Wed", date: "Oct 30", time: "2:00 PM",  title: "Peer Review — Data Visualisation", type: "Peer Review", color: "bg-blue-500" },
  { day: "Thu", date: "Oct 31", time: "11:59 PM", title: "Quiz: Machine Learning Basics", type: "Quiz", color: "bg-amber-500" },
  { day: "Fri", date: "Nov 1",  time: "3:00 PM",  title: "Office Hours — Prof. James Li", type: "Live Session", color: "bg-emerald-500" },
];

const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"];

export default function StudentSchedulePage() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-52 shrink-0 bg-white border-r border-slate-100 flex flex-col">
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <Link href="/">
            <span className="text-xl font-bold text-[#FF510E]">EazyTech</span>
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
        <div className="mx-4 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xs font-semibold text-slate-700 mb-2">System Health</p>
          <Progress value={100} className="h-1.5 [&>div]:bg-emerald-500" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Schedule</h1>
            <p className="text-xs text-slate-500 mt-0.5">Week of Oct 28 – Nov 3, 2024</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">← Prev</button>
            <button className="px-4 py-2 text-sm bg-[#FF510E] text-white rounded-lg hover:bg-orange-600 transition-colors">This week</button>
            <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Next →</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="grid grid-cols-3 gap-6">
            {/* Week grid */}
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
                      (h === "2 PM"  && d === "Wed") ||
                      (h === "3 PM"  && d === "Fri");
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

            {/* Upcoming events */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">Upcoming this week</h3>
              <div className="space-y-3">
                {upcoming.map((ev) => (
                  <div key={ev.title} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-1.5 h-1.5 rounded-full ${ev.color} shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">{ev.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{ev.day} {ev.date} · {ev.time}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {ev.type}
                      </span>
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
