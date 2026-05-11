"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Users, BarChart2, DollarSign,
  Calendar, MessageSquare, Settings, HelpCircle, ChevronDown, ChevronUp,
} from "lucide-react";

const nav = [
  { label: "Dashboard",  href: "/dashboard/instructor",           icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/instructor/courses",   icon: BookOpen },
  { label: "Students",   href: "/dashboard/instructor/students",  icon: Users },
  { label: "Analytics",  href: "/dashboard/instructor/analytics", icon: BarChart2 },
  { label: "Revenue",    href: "/dashboard/instructor/revenue",   icon: DollarSign },
  { label: "Schedule",   href: "/dashboard/instructor/schedule",  icon: Calendar },
  { label: "Messages",   href: "/dashboard/instructor/messages",  icon: MessageSquare },
  { label: "Settings",   href: "/dashboard/instructor/settings",  icon: Settings },
  { label: "Help",       href: "/dashboard/instructor/help",      icon: HelpCircle,     active: true },
];

const faqs = [
  { q: "How do I create a new course?",               a: "Click 'Create New Course' from your My Courses page or dashboard. Fill in the course title, description, pricing, and then add curriculum sections. You can save as a draft and publish when ready." },
  { q: "When do I get paid?",                         a: "Payouts are processed on the 5th of each month for earnings from the previous month. You keep 70% of each sale. Ensure your PayPal email is correct in Settings → Payout." },
  { q: "How do I upload course videos?",              a: "Inside each course, go to Curriculum → add a Lesson → choose Video. Upload your MP4 file (max 4GB per file). Processing may take a few minutes." },
  { q: "Can I offer a free preview of my course?",    a: "Yes. When editing a lesson, toggle 'Free Preview' to on. Students who have not purchased the course can watch that specific lesson for free." },
  { q: "How are course ratings calculated?",          a: "Students can rate your course 1–5 stars after completing at least 25% of the content. Your displayed rating is a rolling average of all submitted reviews." },
  { q: "What happens if a student requests a refund?", a: "Students have 14 days to request a refund. Refunds are processed by the platform. Your payout will be adjusted in the following month's statement." },
  { q: "How do I respond to student questions?",      a: "Use the Messages page to communicate directly. You can also reply to forum posts inside the course through your Moodle course dashboard at lms.ezaytech.com." },
];

export default function InstructorHelpPage() {
  const [open, setOpen] = useState<number | null>(null);

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
          <h1 className="text-xl font-bold text-slate-900">Help Centre</h1>
          <p className="text-xs text-slate-500 mt-0.5">Instructor FAQ and support resources</p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="max-w-2xl">
            <h2 className="text-base font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2 mb-10">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <button onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-900 pr-4">{faq.q}</span>
                    {open === i ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {open === i && (
                    <div className="px-5 pb-4 border-t border-slate-100">
                      <p className="text-sm text-slate-600 leading-relaxed pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-1">Need direct support?</h3>
              <p className="text-slate-400 text-sm mb-4">Our instructor success team responds within one business day.</p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-[#FF510E] hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
