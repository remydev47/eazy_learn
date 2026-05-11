"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Users, BarChart2, DollarSign,
  Calendar, MessageSquare, Settings, HelpCircle, Search, Send,
} from "lucide-react";

const nav = [
  { label: "Dashboard",  href: "/dashboard/instructor",           icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/instructor/courses",   icon: BookOpen },
  { label: "Students",   href: "/dashboard/instructor/students",  icon: Users },
  { label: "Analytics",  href: "/dashboard/instructor/analytics", icon: BarChart2 },
  { label: "Revenue",    href: "/dashboard/instructor/revenue",   icon: DollarSign },
  { label: "Schedule",   href: "/dashboard/instructor/schedule",  icon: Calendar },
  { label: "Messages",   href: "/dashboard/instructor/messages",  icon: MessageSquare,  active: true },
  { label: "Settings",   href: "/dashboard/instructor/settings",  icon: Settings },
  { label: "Help",       href: "/dashboard/instructor/help",      icon: HelpCircle },
];

const threads = [
  { id: 1, initials: "JM", color: "bg-blue-500",    name: "Julianne Moore",  course: "UI/UX Fundamentals",      preview: "Can you clarify the wireframe brief?",         time: "1h ago",   unread: 2 },
  { id: 2, initials: "DW", color: "bg-teal-500",    name: "David Wei",       course: "UI/UX Fundamentals",      preview: "Thank you for the feedback on my prototype!",  time: "3h ago",   unread: 0 },
  { id: 3, initials: "EL", color: "bg-rose-500",    name: "Elena Lopez",     course: "Data Decision Making",    preview: "My dataset export seems to be broken…",        time: "Yesterday",unread: 1 },
  { id: 4, initials: "PN", color: "bg-amber-500",   name: "Pavel Ostrovsky", course: "Data Decision Making",    preview: "I missed last week's session, is there a rec…", time: "Oct 22",   unread: 0 },
];

const messages = [
  { from: "Julianne Moore", self: false, text: "Hi Dr. Rossi! Can you clarify what format the wireframe brief should be submitted in? PDF or Figma?", time: "9:02 AM" },
  { from: "You",            self: true,  text: "Hi Julianne! Either format is fine. Figma is preferred so I can leave comments directly. Make sure to share the link with edit access.", time: "9:15 AM" },
  { from: "Julianne Moore", self: false, text: "Perfect, I will use Figma then. Should I include mobile and desktop frames?",                           time: "9:18 AM" },
  { from: "You",            self: true,  text: "Yes, both. Desktop first, then mobile. Focus on the core user flows from the brief — at least 4 screens each.", time: "9:20 AM" },
];

export default function InstructorMessagesPage() {
  const [active, setActive] = useState(1);
  const [draft, setDraft]   = useState("");

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

      <div className="flex-1 flex overflow-hidden">
        {/* Thread list */}
        <div className="w-72 shrink-0 bg-white border-r border-slate-100 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-3">Student Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="text" placeholder="Search…" className="w-full h-9 pl-9 pr-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.map((t) => (
              <button key={t.id} onClick={() => setActive(t.id)}
                className={`w-full text-left px-4 py-4 border-b border-slate-50 flex items-start gap-3 transition-colors ${
                  active === t.id ? "bg-orange-50" : "hover:bg-slate-50"
                }`}
              >
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-xs font-bold">{t.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <span className="text-xs text-slate-400">{t.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{t.course}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{t.preview}</p>
                </div>
                {t.unread > 0 && (
                  <span className="w-4 h-4 bg-[#FF510E] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-[9px] font-bold">{t.unread}</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">JM</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Julianne Moore</p>
              <p className="text-xs text-slate-500">Student · UI/UX Fundamentals</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.self ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.self
                    ? "bg-[#FF510E] text-white rounded-br-sm"
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                }`}>
                  {msg.text}
                  <p className={`text-[10px] mt-1 ${msg.self ? "text-orange-200" : "text-slate-400"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center gap-3">
            <input type="text" value={draft} onChange={(e) => setDraft(e.target.value)}
              placeholder="Reply to student…"
              className="flex-1 h-10 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20" />
            <button onClick={() => setDraft("")}
              className="w-10 h-10 bg-[#FF510E] hover:bg-orange-600 text-white rounded-xl flex items-center justify-center transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
