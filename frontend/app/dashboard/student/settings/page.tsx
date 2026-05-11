"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList,
  Award, MessageSquare, Settings, HelpCircle, Check, Save,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const nav = [
  { label: "Dashboard",    href: "/dashboard/student",              icon: LayoutDashboard },
  { label: "My Courses",   href: "/dashboard/student/courses",      icon: BookOpen },
  { label: "Schedule",     href: "/dashboard/student/schedule",     icon: Calendar },
  { label: "Assignments",  href: "/dashboard/student/assignments",  icon: ClipboardList },
  { label: "Certificates", href: "/dashboard/student/certificates", icon: Award },
  { label: "Messages",     href: "/dashboard/student/messages",     icon: MessageSquare },
  { label: "Settings",     href: "/dashboard/student/settings",     icon: Settings, active: true },
  { label: "Help",         href: "/dashboard/student/help",         icon: HelpCircle },
];

type Tab = "Profile" | "Notifications" | "Security";

export default function StudentSettingsPage() {
  const [tab, setTab] = useState<Tab>("Profile");
  const [saved, setSaved] = useState(false);
  const [emailNotif, setEmailNotif]       = useState(true);
  const [deadlineReminder, setDeadline]   = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

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
          <h1 className="text-xl font-bold text-slate-900">Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your profile and preferences</p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">
          {/* Tab nav */}
          <div className="flex items-center gap-1 mb-8 bg-white border border-slate-200 rounded-xl p-1 w-fit">
            {(["Profile", "Notifications", "Security"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t ? "bg-[#FF510E] text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="max-w-2xl">
            {tab === "Profile" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <h3 className="font-bold text-slate-900">Profile Information</h3>
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-[#FF510E] flex items-center justify-center">
                    <span className="text-white text-xl font-bold">JS</span>
                  </div>
                  <button className="text-sm font-semibold text-[#FF510E] hover:underline">Change photo</button>
                </div>
                {[["First name", "Jane"], ["Last name", "Student"], ["Email address", "jane@example.com"], ["Bio", ""]].map(([label, val]) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                    {label === "Bio" ? (
                      <textarea rows={3} defaultValue={val} placeholder="Tell instructors about yourself…"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20 resize-none" />
                    ) : (
                      <input type={label.includes("Email") ? "email" : "text"} defaultValue={val}
                        className="w-full h-10 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {tab === "Notifications" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <h3 className="font-bold text-slate-900">Notification Preferences</h3>
                {[
                  { label: "Email notifications",     desc: "Receive updates via email",                 value: emailNotif,       set: setEmailNotif       },
                  { label: "Deadline reminders",       desc: "24h before assignment due dates",           value: deadlineReminder, set: setDeadline         },
                  { label: "Course update alerts",     desc: "When instructors add new content",          value: courseUpdates,    set: setCourseUpdates    },
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

            {tab === "Security" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <h3 className="font-bold text-slate-900">Security</h3>
                {[["Current password", "password"], ["New password", "password"], ["Confirm new password", "password"]].map(([label, type]) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                    <input type={type} placeholder="••••••••"
                      className="w-full h-10 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20" />
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
