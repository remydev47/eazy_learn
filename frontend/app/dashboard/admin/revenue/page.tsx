"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Settings,
  Search,
  Bell,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

type PayoutStatus = "Pending" | "Processed" | "On Hold";
type TxFilter = "All" | "Successful" | "Refunded";

const pendingPayouts = [
  { id: 1, instructor: "Dr. Elena Rossi",    initials: "ER", color: "bg-violet-500", amount: 4820, method: "PayPal",    status: "Pending"   as PayoutStatus },
  { id: 2, instructor: "Prof. James Li",     initials: "JL", color: "bg-blue-500",   amount: 9250, method: "Stripe",    status: "Pending"   as PayoutStatus },
  { id: 3, instructor: "Marco Valerio",      initials: "MV", color: "bg-amber-500",  amount: 3100, method: "Bank Wire", status: "On Hold"   as PayoutStatus },
  { id: 4, instructor: "Fatima Ndiaye",      initials: "FN", color: "bg-teal-500",   amount: 1780, method: "PayPal",    status: "Processed" as PayoutStatus },
  { id: 5, instructor: "Kevin Okafor",       initials: "KO", color: "bg-indigo-500", amount: 2400, method: "Stripe",    status: "Pending"   as PayoutStatus },
];

const transactions = [
  { id: "TXN-9821", student: "Julianne Moore",   course: "Machine Learning Eng.",        amount: 149, date: "Oct 24",  status: "Successful" as const },
  { id: "TXN-9820", student: "David Wei",         course: "Advanced UI/UX Fundamentals",  amount: 89,  date: "Oct 24",  status: "Successful" as const },
  { id: "TXN-9819", student: "Pavel Ostrovsky",   course: "Data-Driven Decision Making",  amount: 79,  date: "Oct 23",  status: "Refunded"   as const },
  { id: "TXN-9818", student: "Elena Lopez",       course: "Cloud Architecture",           amount: 129, date: "Oct 23",  status: "Successful" as const },
  { id: "TXN-9817", student: "Robert Kincaid",    course: "Prof. Career Development",     amount: 99,  date: "Oct 22",  status: "Successful" as const },
];

const categories = [
  { label: "Technology",   revenue: 482000, pct: 92 },
  { label: "Data Science", revenue: 310000, pct: 74 },
  { label: "Design",       revenue: 248000, pct: 60 },
  { label: "Business",     revenue: 195000, pct: 47 },
  { label: "Education",    revenue: 98000,  pct: 24 },
];

const navItems = [
  { label: "Overview",          href: "/dashboard/admin",          icon: LayoutDashboard },
  { label: "Users",             href: "/dashboard/admin/users",    icon: Users },
  { label: "Course Management", href: "/dashboard/admin/courses",  icon: BookOpen },
  { label: "Payouts",           href: "/dashboard/admin/revenue",  icon: CreditCard, active: true },
  { label: "Settings",          href: "/dashboard/admin/settings", icon: Settings },
];

const payoutStatusStyles: Record<PayoutStatus, string> = {
  Pending:   "bg-amber-50 text-amber-700 border-amber-200",
  Processed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "On Hold": "bg-rose-50 text-rose-700 border-rose-200",
};

const txStatusStyles: Record<string, string> = {
  Successful: "bg-emerald-50 text-emerald-700",
  Refunded:   "bg-rose-50 text-rose-600",
};

export default function AdminRevenuePage() {
  const [txFilter, setTxFilter] = useState<TxFilter>("All");
  const [page, setPage]         = useState(1);

  const filteredTx = transactions.filter((t) =>
    txFilter === "All" || t.status === txFilter
  );

  const statCards = [
    { label: "Total Revenue",    value: "$1,482,904", delta: "+12.5% vs last month", color: "text-[#FF510E]", bg: "" },
    { label: "This Month",       value: "$198,000",   delta: "+8.3% vs Sep",         color: "text-slate-900", bg: "" },
    { label: "Pending Payouts",  value: "$21,350",    delta: "5 instructors",         color: "text-amber-600", bg: "" },
    { label: "Platform Cut (30%)", value: "$59,400",  delta: "Oct 2024",             color: "text-emerald-600", bg: "" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="w-52 shrink-0 bg-white border-r border-slate-100 flex flex-col">
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-0.5 mb-1">
            <span className="text-xl font-bold text-slate-900">Eazy</span>
            <span className="text-xl font-bold text-[#FF510E]">Tech</span>
          </Link>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Academic Admin
          </p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-[#FF510E] text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mx-4 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-700">System Health: 100%</span>
          </div>
          <Progress value={100} className="h-1.5 [&>div]:bg-emerald-500" />
        </div>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">DH</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">Dean Henderson</p>
              <p className="text-xs text-slate-500 truncate">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Financial Oversight</h1>
            <p className="text-xs text-slate-500 mt-0.5">Platform revenue, payouts and transaction history</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search transactions..." className="pl-9 w-56 h-9 text-sm" />
            </div>
            <button className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <button className="flex items-center gap-2 bg-[#FF510E] hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            {statCards.map((card) => (
              <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-medium text-slate-500 mb-2">{card.label}</p>
                <p className={`text-3xl font-bold ${card.color} mb-1`}>{card.value}</p>
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                  <p className="text-xs text-slate-400">{card.delta}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue chart + Top Categories */}
          <div className="grid grid-cols-3 gap-5 mb-8">
            {/* Revenue chart */}
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Revenue Performance</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Jun 2024 – Feb 2025</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +12.5%
                </div>
              </div>
              <RevenueChart />
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">Top Categories</h3>
              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{cat.label}</span>
                      <span className="text-slate-500">${(cat.revenue / 1000).toFixed(0)}k</span>
                    </div>
                    <Progress value={cat.pct} className="h-2 [&>div]:bg-[#FF510E]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Payouts */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pending Payouts</h3>
                <p className="text-xs text-slate-500 mt-0.5">Instructor earnings awaiting disbursement</p>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-0 text-xs font-semibold">
                {pendingPayouts.filter((p) => p.status === "Pending").length} Pending
              </Badge>
            </div>
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
              {["Instructor", "Amount", "Method", "Status", "Actions"].map((h) => (
                <span key={h} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</span>
              ))}
            </div>
            {pendingPayouts.map((payout) => (
              <div
                key={payout.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50/60 transition-colors items-center"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${payout.color} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-xs font-bold">{payout.initials}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{payout.instructor}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">${payout.amount.toLocaleString()}.00</span>
                <span className="text-sm text-slate-600">{payout.method}</span>
                <Badge variant="outline" className={`text-xs font-semibold w-fit ${payoutStatusStyles[payout.status]}`}>
                  {payout.status}
                </Badge>
                <div className="flex items-center gap-2">
                  {payout.status !== "Processed" && (
                    <button className="text-xs font-semibold text-[#FF510E] hover:underline">Pay Now</button>
                  )}
                  <button className="text-xs font-medium text-slate-400 hover:text-slate-600">View</button>
                </div>
              </div>
            ))}
          </div>

          {/* Transaction Log */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <h3 className="text-base font-bold text-slate-900">Transaction Log</h3>
              <div className="flex items-center gap-1">
                {(["All", "Successful", "Refunded"] as TxFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => { setTxFilter(f); setPage(1); }}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      txFilter === f
                        ? "bg-[#FF510E] text-white"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[1fr_2fr_2fr_1fr_1fr] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
              {["Txn ID", "Student", "Course", "Amount", "Status"].map((h) => (
                <span key={h} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</span>
              ))}
            </div>
            {filteredTx.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-[1fr_2fr_2fr_1fr_1fr] gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50/60 transition-colors items-center"
              >
                <span className="text-xs font-mono text-slate-500">{tx.id}</span>
                <span className="text-sm font-medium text-slate-800 truncate">{tx.student}</span>
                <span className="text-sm text-slate-600 truncate">{tx.course}</span>
                <span className="text-sm font-bold text-slate-900">${tx.amount}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${txStatusStyles[tx.status]}`}>
                  {tx.status}
                </span>
              </div>
            ))}
            {/* Pagination row */}
            <div className="px-6 py-4 flex items-center justify-between">
              <p className="text-xs text-slate-500">Showing {filteredTx.length} transactions</p>
              <div className="flex items-center gap-1">
                <button disabled className="p-1.5 rounded-lg border border-slate-200 opacity-40">
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <button className="w-8 h-8 rounded-lg text-sm font-medium bg-[#FF510E] text-white">1</button>
                <button disabled className="p-1.5 rounded-lg border border-slate-200 opacity-40">
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
