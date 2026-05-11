"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Settings,
  Search,
  Bell,
  Plus,
  Download,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

type Role   = "INSTRUCTOR" | "STUDENT" | "ADMIN";
type Status = "Active" | "Pending" | "Banned";

const allUsers = [
  { id: 1, initials: "JM", color: "bg-blue-500",    name: "Julianne Moore",    email: "jmoore@academia.edu",   role: "INSTRUCTOR" as Role, joined: "Oct 12, 2024", status: "Active"  as Status, courses: 5,  lastSeen: "2h ago" },
  { id: 2, initials: "RK", color: "bg-violet-500",  name: "Robert Kincaid",    email: "rkinc@protonmail.com",  role: "STUDENT"    as Role, joined: "Oct 15, 2024", status: "Active"  as Status, courses: 3,  lastSeen: "4h ago" },
  { id: 3, initials: "EL", color: "bg-rose-500",    name: "Elena Lopez",       email: "e.lopez@stanford.edu",  role: "STUDENT"    as Role, joined: "Oct 18, 2024", status: "Pending" as Status, courses: 0,  lastSeen: "1d ago" },
  { id: 4, initials: "MS", color: "bg-amber-500",   name: "Markus Söderberg",  email: "markus.s@web.de",       role: "INSTRUCTOR" as Role, joined: "Oct 20, 2024", status: "Banned"  as Status, courses: 2,  lastSeen: "5d ago" },
  { id: 5, initials: "TM", color: "bg-emerald-600", name: "Tanya Mikhailov",   email: "tmikh@eazytech.com",    role: "ADMIN"      as Role, joined: "Jan 02, 2024", status: "Active"  as Status, courses: 0,  lastSeen: "Just now" },
  { id: 6, initials: "DW", color: "bg-teal-500",    name: "David Wei",         email: "dwei@gmail.com",        role: "STUDENT"    as Role, joined: "Sep 08, 2024", status: "Active"  as Status, courses: 7,  lastSeen: "3h ago" },
  { id: 7, initials: "FN", color: "bg-indigo-500",  name: "Fatima Ndiaye",     email: "f.ndiaye@univ.fr",      role: "INSTRUCTOR" as Role, joined: "Aug 14, 2024", status: "Active"  as Status, courses: 4,  lastSeen: "1h ago" },
  { id: 8, initials: "PO", color: "bg-orange-500",  name: "Pavel Ostrovsky",   email: "p.ostrov@ru.edu",       role: "STUDENT"    as Role, joined: "Oct 22, 2024", status: "Pending" as Status, courses: 0,  lastSeen: "2d ago" },
];

const securityLogs = [
  { time: "Oct 24 14:32", user: "Markus Söderberg", event: "Account suspended", severity: "high" },
  { time: "Oct 24 12:10", user: "Elena Lopez",      event: "Failed login × 5",  severity: "warn" },
  { time: "Oct 24 09:45", user: "Tanya Mikhailov",  event: "Role changed → ADMIN", severity: "info" },
  { time: "Oct 23 22:01", user: "David Wei",        event: "Password reset",    severity: "info" },
];

const navItems = [
  { label: "Overview",          href: "/dashboard/admin",          icon: LayoutDashboard },
  { label: "Users",             href: "/dashboard/admin/users",    icon: Users, active: true },
  { label: "Course Management", href: "/dashboard/admin/courses",  icon: BookOpen },
  { label: "Payouts",           href: "/dashboard/admin/revenue",  icon: CreditCard },
  { label: "Settings",          href: "/dashboard/admin/settings", icon: Settings },
];

const roleBadge: Record<Role, string> = {
  INSTRUCTOR: "bg-blue-50 text-blue-700 border-blue-200",
  STUDENT:    "bg-slate-100 text-slate-600 border-slate-200",
  ADMIN:      "bg-violet-50 text-violet-700 border-violet-200",
};

const statusDot: Record<Status, string> = {
  Active:  "bg-emerald-500",
  Pending: "bg-amber-400",
  Banned:  "bg-rose-500",
};

const statusText: Record<Status, string> = {
  Active:  "text-emerald-600",
  Pending: "text-amber-600",
  Banned:  "text-rose-600",
};

const severityStyles: Record<string, string> = {
  high: "bg-rose-50 text-rose-600",
  warn: "bg-amber-50 text-amber-600",
  info: "bg-slate-50 text-slate-500",
};

const PAGE_SIZE = 6;

export default function AdminUsersPage() {
  const [search, setSearch]     = useState("");
  const [roleFilter, setRole]   = useState<"All" | Role>("All");
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = useMemo(() => {
    return allUsers.filter((u) => {
      const matchRole   = roleFilter === "All" || u.role === roleFilter;
      const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [search, roleFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allChecked = paginated.length > 0 && paginated.every((u) => selected.includes(u.id));

  function toggleAll() {
    if (allChecked) setSelected((s) => s.filter((id) => !paginated.map((u) => u.id).includes(id)));
    else setSelected((s) => [...new Set([...s, ...paginated.map((u) => u.id)])]);
  }

  function toggle(id: number) {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }

  const statCards = [
    { label: "Total Users",    value: "84,201", delta: "+822 this week",  light: false },
    { label: "Instructors",    value: "3,412",  delta: "+18 this month",  light: false },
    { label: "Students",       value: "80,241", delta: "+804 this week",  light: false },
    { label: "Active Today",   value: "1,894",  delta: "▲ 12% vs yesterday", light: true },
    { label: "Pending Review", value: "47",     delta: "Requires action", light: false },
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
            <h1 className="text-xl font-bold text-slate-900">User Directory</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage all platform users and roles</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 w-56 h-9 text-sm"
              />
            </div>
            <button className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">

          {/* Stat cards */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-2xl border p-5 ${
                  card.light ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                }`}
              >
                <p className={`text-xs font-medium mb-2 ${card.light ? "text-slate-400" : "text-slate-500"}`}>
                  {card.label}
                </p>
                <p className={`text-2xl font-bold mb-1 ${card.light ? "text-white" : "text-slate-900"}`}>
                  {card.value}
                </p>
                <p className={`text-xs ${card.light ? "text-[#FF510E]" : "text-slate-400"}`}>{card.delta}</p>
              </div>
            ))}
          </div>

          {/* User table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">
            {/* Table toolbar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                {(["All", "INSTRUCTOR", "STUDENT", "ADMIN"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRole(r); setPage(1); }}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      roleFilter === r
                        ? "bg-[#FF510E] text-white"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    {r === "All" ? "All Users" : r.charAt(0) + r.slice(1).toLowerCase() + "s"}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {selected.length > 0 && (
                  <button className="flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete ({selected.length})
                  </button>
                )}
                <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
                <button className="flex items-center gap-2 bg-[#FF510E] hover:bg-orange-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Add User
                </button>
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_80px] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-slate-300 accent-[#FF510E]"
                />
              </div>
              {["User", "Role", "Status", "Joined", ""].map((h) => (
                <span key={h} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</span>
              ))}
            </div>

            {/* Rows */}
            {paginated.map((user) => (
              <div
                key={user.id}
                className={`grid grid-cols-[40px_2fr_1fr_1fr_1fr_80px] gap-4 px-6 py-4 border-b border-slate-50 items-center transition-colors ${
                  selected.includes(user.id) ? "bg-orange-50/40" : "hover:bg-slate-50/60"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(user.id)}
                    onChange={() => toggle(user.id)}
                    className="w-4 h-4 rounded border-slate-300 accent-[#FF510E]"
                  />
                </div>
                {/* User info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full ${user.color} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-xs font-bold">{user.initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                {/* Role */}
                <Badge variant="outline" className={`text-xs font-semibold w-fit ${roleBadge[user.role]}`}>
                  {user.role}
                </Badge>
                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${statusDot[user.status]}`} />
                  <span className={`text-sm font-medium ${statusText[user.status]}`}>{user.status}</span>
                </div>
                {/* Joined */}
                <div>
                  <p className="text-sm text-slate-600">{user.joined}</p>
                  <p className="text-xs text-slate-400">{user.lastSeen}</p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 justify-end">
                  <button className="text-xs font-medium text-[#FF510E] hover:underline px-2 py-1">Edit</button>
                  <button className="text-xs font-medium text-slate-400 hover:text-slate-600 px-2 py-1">View</button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                {selected.length > 0
                  ? `${selected.length} selected · `
                  : ""}
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      page === p ? "bg-[#FF510E] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom row: User Insights + Security Log + Export Status */}
          <div className="grid grid-cols-3 gap-5">
            {/* Advanced User Insights */}
            <div className="col-span-1 bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-[#FF510E]" />
                <h3 className="text-base font-bold text-slate-900">User Insights</h3>
              </div>
              {[
                { label: "Completion Rate",    value: 68, color: "[&>div]:bg-[#FF510E]" },
                { label: "Avg. Session Time",  value: 82, color: "[&>div]:bg-blue-500" },
                { label: "Retention (30d)",    value: 74, color: "[&>div]:bg-emerald-500" },
                { label: "Mobile Users",       value: 56, color: "[&>div]:bg-violet-500" },
              ].map((item) => (
                <div key={item.label} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">{item.label}</span>
                    <span className="text-slate-900 font-semibold">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className={`h-2 ${item.color}`} />
                </div>
              ))}
            </div>

            {/* Security Log */}
            <div className="col-span-1 bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-[#FF510E]" />
                <h3 className="text-base font-bold text-slate-900">Security Log</h3>
              </div>
              <div className="space-y-3">
                {securityLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${severityStyles[log.severity]}`}>
                      {log.severity.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{log.event}</p>
                      <p className="text-xs text-slate-400">{log.user} · {log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Status */}
            <div className="col-span-1 bg-slate-800 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Download className="w-4 h-4 text-[#FF510E]" />
                <h3 className="text-base font-bold text-white">Export Data</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed flex-1">
                Export the full user directory as CSV or XLSX for offline analysis.
              </p>
              <div className="mt-6 space-y-2">
                <button className="w-full bg-[#FF510E] hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                  Export as CSV
                </button>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                  Export as XLSX
                </button>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <ChevronDown className="w-3 h-3 text-slate-500 rotate-90" />
                <p className="text-xs text-slate-500">Last export: Oct 20, 2024 · 84,201 records</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
