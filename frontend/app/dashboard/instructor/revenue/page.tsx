"use client";

import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Users, BarChart2, DollarSign,
  Calendar, MessageSquare, Settings, HelpCircle, Download, TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

const nav = [
  { label: "Dashboard",  href: "/dashboard/instructor",           icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/instructor/courses",   icon: BookOpen },
  { label: "Students",   href: "/dashboard/instructor/students",  icon: Users },
  { label: "Analytics",  href: "/dashboard/instructor/analytics", icon: BarChart2 },
  { label: "Revenue",    href: "/dashboard/instructor/revenue",   icon: DollarSign,     active: true },
  { label: "Schedule",   href: "/dashboard/instructor/schedule",  icon: Calendar },
  { label: "Messages",   href: "/dashboard/instructor/messages",  icon: MessageSquare },
  { label: "Settings",   href: "/dashboard/instructor/settings",  icon: Settings },
  { label: "Help",       href: "/dashboard/instructor/help",      icon: HelpCircle },
];

const payouts = [
  { month: "Oct 2024", amount: 14290, status: "Pending",   method: "PayPal"    },
  { month: "Sep 2024", amount: 12840, status: "Paid",      method: "PayPal"    },
  { month: "Aug 2024", amount: 11320, status: "Paid",      method: "PayPal"    },
  { month: "Jul 2024", amount: 9870,  status: "Paid",      method: "PayPal"    },
];

const byCourse = [
  { title: "Professional Career Development",   revenue: 34200, pct: 100 },
  { title: "Advanced UI/UX Fundamentals",       revenue: 12450, pct: 36  },
  { title: "Data-Driven Decision Making",       revenue: 8700,  pct: 25  },
];

const statusStyle: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Paid:    "bg-emerald-50 text-emerald-700",
};

export default function InstructorRevenuePage() {
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
            <h1 className="text-xl font-bold text-slate-900">Revenue</h1>
            <p className="text-xs text-slate-500 mt-0.5">Your earnings and payout history</p>
          </div>
          <button className="flex items-center gap-2 bg-[#FF510E] hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Earnings",   value: "$55,350",  delta: "All time",            color: "text-slate-900"   },
              { label: "This Month",       value: "$14,290",  delta: "+11% vs last month",  color: "text-[#FF510E]"   },
              { label: "Pending Payout",   value: "$14,290",  delta: "Disbursed ~Nov 5",    color: "text-amber-600"   },
              { label: "Platform Fee",     value: "30%",      delta: "70% goes to you",     color: "text-slate-500"   },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-xs text-slate-500 mb-1">{c.label}</p>
                <p className={`text-3xl font-bold ${c.color} mb-1`}>{c.value}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <p className="text-xs text-slate-400">{c.delta}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-5 mb-8">
            {/* Revenue chart */}
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-1">Revenue Performance</h3>
              <p className="text-xs text-slate-500 mb-4">Jun 2024 – Feb 2025 (70% instructor share shown)</p>
              <RevenueChart />
            </div>

            {/* By course */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">Revenue by Course</h3>
              <div className="space-y-4">
                {byCourse.map((c) => (
                  <div key={c.title}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-700 font-medium truncate pr-3">{c.title}</span>
                      <span className="text-slate-500 shrink-0">${(c.revenue / 1000).toFixed(1)}k</span>
                    </div>
                    <Progress value={c.pct} className="h-2 [&>div]:bg-[#FF510E]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payout history */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Payout History</h3>
            </div>
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
              {["Period", "Amount", "Method", "Status"].map((h) => (
                <span key={h} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</span>
              ))}
            </div>
            {payouts.map((p) => (
              <div key={p.month} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50/60 transition-colors items-center">
                <span className="text-sm font-semibold text-slate-900">{p.month}</span>
                <span className="text-sm font-bold text-slate-900">${p.amount.toLocaleString()}.00</span>
                <span className="text-sm text-slate-600">{p.method}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${statusStyle[p.status]}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
