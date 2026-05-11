"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Users, BarChart2, DollarSign,
  Calendar, MessageSquare, Settings, HelpCircle, Check, Save,
} from "lucide-react";

const nav = [
  { label: "Dashboard",  href: "/dashboard/instructor",           icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/instructor/courses",   icon: BookOpen },
  { label: "Students",   href: "/dashboard/instructor/students",  icon: Users },
  { label: "Analytics",  href: "/dashboard/instructor/analytics", icon: BarChart2 },
  { label: "Revenue",    href: "/dashboard/instructor/revenue",   icon: DollarSign },
  { label: "Schedule",   href: "/dashboard/instructor/schedule",  icon: Calendar },
  { label: "Messages",   href: "/dashboard/instructor/messages",  icon: MessageSquare },
  { label: "Settings",   href: "/dashboard/instructor/settings",  icon: Settings,       active: true },
  { label: "Help",       href: "/dashboard/instructor/help",      icon: HelpCircle },
];

type Tab = "Profile" | "Payout" | "Notifications";

export default function InstructorSettingsPage() {
  const [tab, setTab] = useState<Tab>("Profile");
  const [saved, setSaved] = useState(false);
  const [newEnrol, setNewEnrol]   = useState(true);
  const [newReview, setNewReview] = useState(true);
  const [newMessage, setNewMsg]   = useState(true);

  function save() { setSaved(true); setTimeout(() => setSaved(false), 3000); }

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
          <h1 className="text-xl font-bold text-slate-900">Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your instructor profile and preferences</p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="flex items-center gap-1 mb-8 bg-white border border-slate-200 rounded-xl p-1 w-fit">
            {(["Profile", "Payout", "Notifications"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t ? "bg-[#FF510E] text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}>{t}</button>
            ))}
          </div>

          <div className="max-w-2xl">
            {tab === "Profile" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <h3 className="font-bold text-slate-900">Instructor Profile</h3>
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-violet-500 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">ER</span>
                  </div>
                  <button className="text-sm font-semibold text-[#FF510E] hover:underline">Change photo</button>
                </div>
                {[["First name", "Elena"], ["Last name", "Rossi"], ["Title / Prefix", "Dr."], ["Email address", "e.rossi@eazytech.com"], ["Professional headline", "UX Researcher & Senior Instructor"]].map(([label, val]) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                    <input type={label.includes("Email") ? "email" : "text"} defaultValue={val}
                      className="w-full h-10 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                  <textarea rows={4} defaultValue="Dr. Elena Rossi is a senior UX researcher with 12 years of industry experience at leading design agencies. She has trained over 12,000 students worldwide."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20 resize-none" />
                </div>
              </div>
            )}

            {tab === "Payout" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <h3 className="font-bold text-slate-900">Payout Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Payout method</label>
                  <select className="w-full h-10 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20 bg-white">
                    <option>PayPal</option>
                    <option>Bank Wire</option>
                    <option>Stripe Connect</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">PayPal email</label>
                  <input type="email" defaultValue="e.rossi.payments@gmail.com"
                    className="w-full h-10 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20" />
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Revenue split</p>
                  <p className="text-sm text-slate-600">You keep <strong>70%</strong> of each course sale. Platform fee: 30%. Payouts are processed on the 5th of each month.</p>
                </div>
              </div>
            )}

            {tab === "Notifications" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <h3 className="font-bold text-slate-900">Notification Preferences</h3>
                {[
                  { label: "New student enrolment",  desc: "Get notified when someone joins your course", value: newEnrol,   set: setNewEnrol   },
                  { label: "New review posted",       desc: "When a student leaves a course rating",       value: newReview,  set: setNewReview  },
                  { label: "New student message",     desc: "When a student sends you a message",          value: newMessage, set: setNewMsg     },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button onClick={() => item.set(!item.value)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${item.value ? "bg-[#FF510E]" : "bg-slate-200"}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.value ? "translate-x-7" : "translate-x-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button onClick={save}
                className={`inline-flex items-center gap-2 font-semibold text-sm px-6 py-2.5 rounded-lg transition-all ${
                  saved ? "bg-emerald-500 text-white" : "bg-[#FF510E] hover:bg-orange-600 text-white"
                }`}
              >
                {saved ? <><Check className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />Save changes</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
