"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList,
  Award, MessageSquare, Settings, HelpCircle, Search, Send,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const nav = [
  { label: "Dashboard",    href: "/dashboard/student",              icon: LayoutDashboard },
  { label: "My Courses",   href: "/dashboard/student/courses",      icon: BookOpen },
  { label: "Schedule",     href: "/dashboard/student/schedule",     icon: Calendar },
  { label: "Assignments",  href: "/dashboard/student/assignments",  icon: ClipboardList },
  { label: "Certificates", href: "/dashboard/student/certificates", icon: Award },
  { label: "Messages",     href: "/dashboard/student/messages",     icon: MessageSquare, active: true },
  { label: "Settings",     href: "/dashboard/student/settings",     icon: Settings },
  { label: "Help",         href: "/dashboard/student/help",         icon: HelpCircle },
];

const threads = [
  { id: 1, initials: "ER", color: "bg-violet-500", name: "Dr. Elena Rossi",  role: "Instructor", preview: "Great question about the wireframe assignment...", time: "2h ago",   unread: 2 },
  { id: 2, initials: "JL", color: "bg-blue-500",   name: "Prof. James Li",   role: "Instructor", preview: "Your ML model submission has been reviewed.",       time: "Yesterday",unread: 0 },
  { id: 3, initials: "SA", color: "bg-emerald-500",name: "Support Team",     role: "Support",    preview: "Your refund request has been processed.",           time: "Oct 22",   unread: 0 },
  { id: 4, initials: "RK", color: "bg-amber-500",  name: "Robert Kincaid",   role: "Peer",       preview: "Did you finish the peer review for unit 3?",        time: "Oct 20",   unread: 1 },
];

const messages = [
  { from: "Dr. Elena Rossi",  self: false, text: "Hi! Great question about the wireframe assignment. The key is to focus on user flow first, then iterate on visual design.", time: "10:14 AM" },
  { from: "You",              self: true,  text: "Thanks! So I should map out all the user paths before touching Figma?",                                                     time: "10:17 AM" },
  { from: "Dr. Elena Rossi",  self: false, text: "Exactly. Start with a simple flow diagram — even pen and paper works. Then translate that into low-fidelity frames.",       time: "10:19 AM" },
  { from: "You",              self: true,  text: "Perfect. I will get that done before the deadline. Really appreciate the guidance!",                                        time: "10:21 AM" },
  { from: "Dr. Elena Rossi",  self: false, text: "Great question about the wireframe assignment — looking forward to seeing your final submission!",                           time: "10:32 AM" },
];

export default function StudentMessagesPage() {
  const [active, setActive] = useState(1);
  const [draft, setDraft] = useState("");

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

      <div className="flex-1 flex overflow-hidden">
        {/* Thread list */}
        <div className="w-72 shrink-0 bg-white border-r border-slate-100 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-3">Messages</h2>
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

        {/* Chat window */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat header */}
          <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">ER</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Dr. Elena Rossi</p>
              <p className="text-xs text-slate-500">Instructor · UI/UX Fundamentals</p>
            </div>
          </div>

          {/* Messages */}
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

          {/* Compose */}
          <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center gap-3">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 h-10 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20"
            />
            <button
              onClick={() => setDraft("")}
              className="w-10 h-10 bg-[#FF510E] hover:bg-orange-600 text-white rounded-xl flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
