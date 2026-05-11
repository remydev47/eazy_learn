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
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  Info,
  Activity,
  Cpu,
  HardDrive,
  Globe,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

type Severity = "Error" | "Warning" | "Info";

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  ip: string;
  details: string;
  severity: Severity;
}

const logs: LogEntry[] = [
  { id: "LOG-0981", timestamp: "2024-10-24 14:32:05", user: "Markus Söderberg",  action: "Account suspended by admin",    ip: "185.220.101.4",  details: "Violated TOS §3.2",             severity: "Error"   },
  { id: "LOG-0980", timestamp: "2024-10-24 14:10:22", user: "Elena Lopez",       action: "Failed login attempt ×5",       ip: "203.0.113.42",   details: "Brute force protection triggered", severity: "Error" },
  { id: "LOG-0979", timestamp: "2024-10-24 12:01:14", user: "System",            action: "Payout job delayed >15min",     ip: "—",              details: "Latency spike in payment queue", severity: "Warning"  },
  { id: "LOG-0978", timestamp: "2024-10-24 11:45:30", user: "Tanya Mikhailov",   action: "Role changed to ADMIN",         ip: "10.0.0.1",       details: "Approved by Dean Henderson",    severity: "Warning"  },
  { id: "LOG-0977", timestamp: "2024-10-24 09:55:00", user: "David Wei",         action: "Password reset completed",      ip: "172.16.0.5",     details: "Via email verification",        severity: "Info"     },
  { id: "LOG-0976", timestamp: "2024-10-24 09:30:18", user: "System",            action: "Daily backup completed",        ip: "—",              details: "84,201 records archived",       severity: "Info"     },
  { id: "LOG-0975", timestamp: "2024-10-24 08:12:44", user: "Pavel Ostrovsky",   action: "Course purchase refunded",      ip: "194.165.16.10",  details: "TXN-9819 · $79.00",           severity: "Warning"  },
  { id: "LOG-0974", timestamp: "2024-10-23 22:01:05", user: "Dr. Elena Rossi",   action: "New course submitted for review", ip: "192.168.1.21", details: "Quantum Computing Basics",     severity: "Info"     },
  { id: "LOG-0973", timestamp: "2024-10-23 18:30:55", user: "System",            action: "SSL cert renewal succeeded",    ip: "—",              details: "Expires 2025-10-23",           severity: "Info"     },
  { id: "LOG-0972", timestamp: "2024-10-23 14:00:01", user: "Julianne Moore",    action: "Course published",              ip: "10.10.0.8",      details: "Machine Learning Engineering", severity: "Info"     },
];

const severityStyles: Record<Severity, { dot: string; badge: string; icon: React.ElementType }> = {
  Error:   { dot: "bg-rose-500",   badge: "bg-rose-50 text-rose-600",   icon: AlertCircle   },
  Warning: { dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-600", icon: AlertTriangle },
  Info:    { dot: "bg-blue-400",   badge: "bg-blue-50 text-blue-600",   icon: Info          },
};

const navItems = [
  { label: "Overview",          href: "/dashboard/admin",          icon: LayoutDashboard },
  { label: "Users",             href: "/dashboard/admin/users",    icon: Users },
  { label: "Course Management", href: "/dashboard/admin/courses",  icon: BookOpen },
  { label: "Payouts",           href: "/dashboard/admin/revenue",  icon: CreditCard },
  { label: "Settings",          href: "/dashboard/admin/settings", icon: Settings },
];

const FILTERS: ("All" | Severity)[] = ["All", "Error", "Warning", "Info"];

export default function AdminLogsPage() {
  const [filter, setFilter]   = useState<"All" | Severity>("All");
  const [search, setSearch]   = useState("");

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const matchSev    = filter === "All" || l.severity === filter;
      const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) ||
                          l.user.toLowerCase().includes(search.toLowerCase()) ||
                          l.details.toLowerCase().includes(search.toLowerCase());
      return matchSev && matchSearch;
    });
  }, [filter, search]);

  const counts = {
    Error:   logs.filter((l) => l.severity === "Error").length,
    Warning: logs.filter((l) => l.severity === "Warning").length,
    Info:    logs.filter((l) => l.severity === "Info").length,
  };

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
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
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
            <h1 className="text-xl font-bold text-slate-900">Activity Monitoring</h1>
            <p className="text-xs text-slate-500 mt-0.5">System logs, errors, and access events</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

          {/* Summary chips */}
          <div className="grid grid-cols-3 gap-5 mb-8">
            {(["Error", "Warning", "Info"] as Severity[]).map((sev) => {
              const { badge, icon: Icon } = severityStyles[sev];
              return (
                <div key={sev} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${badge}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">{sev} Events</p>
                    <p className="text-2xl font-bold text-slate-900">{counts[sev]}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Log table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      filter === f
                        ? "bg-[#FF510E] text-white"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    {f}{f !== "All" && <span className="ml-1.5 opacity-70">{counts[f as Severity]}</span>}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <Calendar className="w-3.5 h-3.5" />
                  Oct 24, 2024
                </button>
                <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </button>
                <button className="flex items-center gap-2 bg-[#FF510E] hover:bg-orange-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[100px_1fr_2fr_120px_2fr_80px] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
              {["Severity", "Timestamp", "Action", "User", "Details", "IP"].map((h) => (
                <span key={h} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</span>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((log) => {
              const { dot, badge } = severityStyles[log.severity];
              return (
                <div
                  key={log.id}
                  className="grid grid-cols-[100px_1fr_2fr_120px_2fr_80px] gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50/60 transition-colors items-start"
                >
                  {/* Severity */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>{log.severity}</span>
                  </div>
                  {/* Timestamp */}
                  <span className="text-xs font-mono text-slate-500 pt-0.5 whitespace-nowrap">{log.timestamp}</span>
                  {/* Action */}
                  <span className="text-sm font-medium text-slate-800">{log.action}</span>
                  {/* User */}
                  <span className="text-xs text-slate-600 truncate">{log.user}</span>
                  {/* Details */}
                  <span className="text-xs text-slate-500">{log.details}</span>
                  {/* IP */}
                  <span className="text-xs font-mono text-slate-400">{log.ip}</span>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-slate-400 text-sm">No log entries match your filters.</p>
              </div>
            )}
          </div>

          {/* Resource Monitoring + Global Access */}
          <div className="grid grid-cols-2 gap-5">
            {/* Resource Monitoring */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-4 h-4 text-[#FF510E]" />
                <h3 className="text-base font-bold text-slate-900">Resource Monitoring</h3>
              </div>
              <div className="space-y-5">
                {[
                  { label: "CPU Usage",    value: 34, icon: Cpu,       color: "[&>div]:bg-[#FF510E]",    text: "34%"     },
                  { label: "Memory",       value: 62, icon: Activity,  color: "[&>div]:bg-blue-500",     text: "62%"     },
                  { label: "Disk Usage",   value: 48, icon: HardDrive, color: "[&>div]:bg-emerald-500",  text: "48%"     },
                  { label: "Network I/O",  value: 78, icon: Globe,     color: "[&>div]:bg-violet-500",   text: "78 MB/s" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">{item.label}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{item.text}</span>
                      </div>
                      <Progress value={item.value} className={`h-2 ${item.color}`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Global Access Map placeholder */}
            <div className="bg-slate-800 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-[#FF510E]" />
                <h3 className="text-base font-bold text-white">Global Access Map</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Active user sessions across 62 countries in the last 24 hours.
              </p>
              {/* Simplified map representation */}
              <div className="flex-1 rounded-xl bg-slate-700 flex items-center justify-center min-h-[120px]">
                <div className="text-center">
                  <Globe className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Interactive map available in production</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { region: "Americas", sessions: "41.2k", color: "bg-[#FF510E]" },
                  { region: "Europe",   sessions: "28.8k", color: "bg-blue-500"  },
                  { region: "Asia",     sessions: "14.2k", color: "bg-violet-500" },
                ].map((r) => (
                  <div key={r.region} className="bg-slate-700 rounded-lg p-3">
                    <div className={`w-2 h-2 rounded-full ${r.color} mb-1.5`} />
                    <p className="text-xs text-slate-400">{r.region}</p>
                    <p className="text-sm font-bold text-white">{r.sessions}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
