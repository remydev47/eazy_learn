"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList,
  Award, MessageSquare, Settings, HelpCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const nav = [
  { label: "Dashboard",    href: "/dashboard/student",              icon: LayoutDashboard },
  { label: "My Courses",   href: "/dashboard/student/courses",      icon: BookOpen },
  { label: "Schedule",     href: "/dashboard/student/schedule",     icon: Calendar },
  { label: "Assignments",  href: "/dashboard/student/assignments",  icon: ClipboardList },
  { label: "Certificates", href: "/dashboard/student/certificates", icon: Award },
  { label: "Messages",     href: "/dashboard/student/messages",     icon: MessageSquare },
  { label: "Settings",     href: "/dashboard/student/settings",     icon: Settings },
  { label: "Help",         href: "/dashboard/student/help",         icon: HelpCircle, active: true },
];

const faqs = [
  { q: "How do I access a course I purchased?",    a: "After purchase, go to My Courses. Your course will appear there immediately. Click 'Go to Course' to start learning." },
  { q: "How do I submit an assignment?",           a: "Open the assignment from your Assignments page or within the course. Upload your file or fill in the text field and click Submit before the deadline." },
  { q: "Can I download course videos?",            a: "Video downloads are not available to prevent piracy. You can access all content online at any time as long as your enrolment is active." },
  { q: "How do I get my certificate?",             a: "Complete all course activities and pass any required assessments. Your certificate will appear automatically on your Certificates page within 24 hours." },
  { q: "What is the refund policy?",               a: "We offer a 14-day money-back guarantee. Contact support@eazytech.com within 14 days of purchase with your order details." },
  { q: "How do I contact my instructor?",          a: "Use the Messages page to send a direct message to your instructor. Most instructors respond within 2 business days." },
  { q: "My video is not playing — what do I do?", a: "Try refreshing the page or clearing your browser cache. If the problem persists, try a different browser or contact our support team." },
];

export default function StudentHelpPage() {
  const [open, setOpen] = useState<number | null>(null);

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
          <h1 className="text-xl font-bold text-slate-900">Help Centre</h1>
          <p className="text-xs text-slate-500 mt-0.5">Frequently asked questions and support</p>
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

            <div className="bg-[#FF510E] rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-1">Still need help?</h3>
              <p className="text-orange-100 text-sm mb-4">Our support team responds within one business day.</p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-white text-[#FF510E] font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-orange-50 transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
