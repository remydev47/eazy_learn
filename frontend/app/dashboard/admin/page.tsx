"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Settings,
  Search,
  Bell,
  AlertTriangle,
  UserPlus,
  SlidersHorizontal,
  Plus,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

/* ── Mock data ── */
const pendingApprovals = [
  {
    id: 1,
    title: "Advanced Quantum Computing",
    instructor: "Dr. Sarah Chen",
    image: "/assets/less4.webp",
  },
  {
    id: 2,
    title: "Python for High-Performance Computing",
    instructor: "Marco Valerio",
    image: "/assets/less3.webp",
  },
];

const users = [
  {
    initials: "JD",
    color: "bg-blue-500",
    name: "Julianne Moore",
    email: "jmoore@academia.edu",
    role: "INSTRUCTOR",
    joined: "Oct 12, 2024",
    status: "Active",
    statusColor: "text-emerald-600",
  },
  {
    initials: "RK",
    color: "bg-violet-500",
    name: "Robert Kincaid",
    email: "rkinc@protonmail.com",
    role: "STUDENT",
    joined: "Oct 15, 2024",
    status: "Active",
    statusColor: "text-emerald-600",
  },
  {
    initials: "EL",
    color: "bg-rose-500",
    name: "Elena Lopez",
    email: "e.lopez@stanford.edu",
    role: "STUDENT",
    joined: "Oct 18, 2024",
    status: "Pending",
    statusColor: "text-amber-600",
  },
  {
    initials: "MS",
    color: "bg-amber-500",
    name: "Markus Söderberg",
    email: "markus.s@web.de",
    role: "INSTRUCTOR",
    joined: "Oct 20, 2024",
    status: "Banned",
    statusColor: "text-rose-600",
  },
  {
    initials: "TM",
    color: "bg-emerald-600",
    name: "Tanya Mikhailov",
    email: "tmikh@eazytech.com",
    role: "ADMIN",
    joined: "Jan 02, 2024",
    status: "Active",
    statusColor: "text-emerald-600",
  },
];

const navItems = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard, active: true },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Course Management", href: "/dashboard/admin/courses", icon: BookOpen },
  { label: "Revenue", href: "/dashboard/admin/revenue", icon: CreditCard },
  { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

const roleBadgeColors: Record<string, string> = {
  INSTRUCTOR: "bg-blue-50 text-blue-700 border-blue-200",
  STUDENT: "bg-slate-100 text-slate-600 border-slate-200",
  ADMIN: "bg-violet-50 text-violet-700 border-violet-200",
};

export default function AdminConsolePage() {
  const [revenueView, setRevenueView] = useState<"Weekly" | "Monthly">("Monthly");
  const [searchQuery, setSearchQuery] = useState("");

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

        {/* System Health */}
        <div className="mx-4 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-700">System Health: 100%</span>
          </div>
          <Progress value={100} className="h-1.5 [&>div]:bg-emerald-500" />
        </div>

        {/* User profile */}
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
        <div className="flex-1 overflow-y-auto">

          {/* Top bar */}
          <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-10">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Console</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Welcome back, monitoring platform activity for Oct 24, 2024
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Global Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-56 h-9 text-sm"
                />
              </div>
              <button className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6 max-w-7xl mx-auto">

            {/* Alert banner */}
            <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 rounded-xl p-4 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-900">High Payout Latency</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Withdrawal requests for Stripe Connect are taking longer than average.
                  Investigating upstream provider.
                </p>
              </div>
              <Button
                size="sm"
                className="bg-amber-800 hover:bg-amber-900 text-white font-semibold shrink-0"
              >
                View Logs
              </Button>
            </div>

            {/* Revenue + Active Users + Signups */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

              {/* Revenue card (spans 2 cols) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                      Total Platform Revenue
                    </p>
                    <p className="text-4xl font-bold text-slate-900">$1,482,904.00</p>
                    <p className="text-sm text-emerald-600 font-medium mt-1">↑ +12.5% from last month</p>
                  </div>
                  <div className="flex gap-2">
                    {(["Weekly", "Monthly"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setRevenueView(v)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          revenueView === v
                            ? "bg-[#FF510E] text-white"
                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <RevenueChart />
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-5">
                {/* Active Users */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-[#FF510E]/10 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#FF510E]" />
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">+4k</span>
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Active Users</p>
                  <p className="text-3xl font-bold text-slate-900">84,201</p>
                </div>

                {/* New Signups — dark card */}
                <div className="bg-slate-800 rounded-2xl p-5 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-emerald-400">+822</span>
                  </div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">New Signups</p>
                  <p className="text-3xl font-bold text-white">1,248</p>
                  <p className="text-xs text-slate-500 mt-1">Past 24 hours activity</p>
                </div>
              </div>
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Left: Pending Approvals + Report */}
              <div className="flex flex-col gap-5">
                {/* Pending Approvals */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-slate-900">Pending Approvals</h2>
                    <span className="bg-[#FF510E] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      12 New
                    </span>
                  </div>
                  <div className="space-y-3">
                    {pendingApprovals.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                      >
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                          <p className="text-xs text-slate-500">by {item.instructor}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button className="text-xs font-semibold text-[#FF510E] hover:underline">
                            APPROVE
                          </button>
                          <button className="text-xs font-semibold text-slate-400 hover:text-slate-600 hover:underline">
                            REVIEW
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 text-sm text-slate-500 hover:text-slate-800 hover:underline transition-colors">
                    View All Submissions
                  </button>
                </div>

                {/* Quarterly Report card */}
                <div className="bg-gradient-to-br from-[#FF510E] to-orange-600 rounded-2xl p-6 text-white">
                  <h2 className="text-lg font-bold mb-2">
                    EazyTech Quarterly<br />Report is Ready
                  </h2>
                  <p className="text-sm text-white/80 mb-5 leading-relaxed">
                    Deep dive into instructor performance and course retention metrics for Q3.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-[#FF510E] border-0 hover:bg-white/90 font-semibold gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </div>
              </div>

              {/* Right: User Management */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900">User Management</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5 h-8"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      Filter
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#FF510E] hover:bg-orange-600 text-white text-xs gap-1.5 h-8"
                    >
                      <Plus className="w-3 h-3" />
                      Add User
                    </Button>
                  </div>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-3 pb-2 border-b border-slate-100">
                  {["USER", "ROLE", "JOINED", "STATUS"].map((h) => (
                    <p key={h} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      {h}
                    </p>
                  ))}
                </div>

                {/* Table rows */}
                <div className="divide-y divide-slate-50">
                  {users.map((user) => (
                    <div
                      key={user.email}
                      className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center px-3 py-3 hover:bg-slate-50/50 transition-colors rounded-lg"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 ${user.color} rounded-full flex items-center justify-center shrink-0`}
                        >
                          <span className="text-white text-xs font-bold">{user.initials}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-md border ${
                          roleBadgeColors[user.role] ?? "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.role}
                      </span>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{user.joined}</span>
                      <span className={`text-xs font-semibold ${user.statusColor}`}>
                        • {user.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">Showing 5 of 1,248 users</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-3 text-xs gap-1"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      Prev
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 px-3 text-xs gap-1 bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      Next
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
          <div className="px-6 py-5 flex flex-col sm:flex-row justify-between gap-4 text-xs">
            <div>
              <p className="font-bold text-white mb-0.5">EazyTech Academic</p>
              <p>© 2026 EazyTech. All rights reserved.</p>
            </div>
            <div className="flex gap-5 items-center">
              <Link href="#" className="hover:text-white transition-colors">System Status</Link>
              <Link href="#" className="hover:text-white transition-colors">API Docs</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Help Center</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
