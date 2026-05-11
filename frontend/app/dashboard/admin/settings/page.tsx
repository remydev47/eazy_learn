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
  Globe,
  Lock,
  Mail,
  Puzzle,
  Cloud,
  Eye,
  EyeOff,
  Save,
  Check,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

type Tab = "General" | "Payments" | "Email" | "Security" | "Integrations";

const navItems = [
  { label: "Overview",          href: "/dashboard/admin",          icon: LayoutDashboard },
  { label: "Users",             href: "/dashboard/admin/users",    icon: Users },
  { label: "Course Management", href: "/dashboard/admin/courses",  icon: BookOpen },
  { label: "Payouts",           href: "/dashboard/admin/revenue",  icon: CreditCard },
  { label: "Settings",          href: "/dashboard/admin/settings", icon: Settings, active: true },
];

const TABS: { id: Tab; icon: React.ElementType }[] = [
  { id: "General",      icon: Globe },
  { id: "Payments",     icon: CreditCard },
  { id: "Email",        icon: Mail },
  { id: "Security",     icon: Lock },
  { id: "Integrations", icon: Puzzle },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const [showStripe, setShowStripe]   = useState(false);
  const [showPayPal, setShowPayPal]   = useState(false);
  const [twoFA, setTwoFA]             = useState(true);
  const [emailVerify, setEmailVerify] = useState(true);
  const [saved, setSaved]             = useState(false);
  const [platformName, setPlatformName] = useState("EazyTech LMS");
  const [supportEmail, setSupportEmail] = useState("support@eazytech.com");
  const [siteUrl, setSiteUrl]           = useState("https://eazytech.com");

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

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
            <h1 className="text-xl font-bold text-slate-900">System Settings</h1>
            <p className="text-xs text-slate-500 mt-0.5">Platform configuration and integrations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Global Search..." className="pl-9 w-56 h-9 text-sm" />
            </div>
            <button className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">

          {/* Tab nav */}
          <div className="flex items-center gap-1 mb-8 bg-white border border-slate-200 rounded-xl p-1 w-fit">
            {TABS.map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === id
                    ? "bg-[#FF510E] text-white"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {id}
              </button>
            ))}
          </div>

          {/* General */}
          {activeTab === "General" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-base font-bold text-slate-900 mb-1">Platform Identity</h3>
                <p className="text-xs text-slate-500 mb-5">Core settings visible to all users across the platform.</p>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Platform Name</label>
                    <Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="h-10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Support Email</label>
                    <Input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} type="email" className="h-10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Site URL</label>
                    <Input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className="h-10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Default Language</label>
                    <select className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20">
                      <option>English (US)</option>
                      <option>French</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Timezone</label>
                    <select className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20">
                      <option>UTC+0 — London</option>
                      <option>UTC-5 — New York</option>
                      <option>UTC+1 — Paris</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Currency</label>
                    <select className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20">
                      <option>USD — US Dollar</option>
                      <option>EUR — Euro</option>
                      <option>GBP — British Pound</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments */}
          {activeTab === "Payments" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-base font-bold text-slate-900 mb-1">Payments & API Keys</h3>
                <p className="text-xs text-slate-500 mb-5">Configure payment gateways. Keys are stored encrypted.</p>
                <div className="space-y-5">
                  {/* Stripe */}
                  <div className="border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">S</span>
                        </div>
                        <span className="font-semibold text-slate-900">Stripe</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Connected</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Publishable Key</label>
                        <div className="relative">
                          <Input
                            type={showStripe ? "text" : "password"}
                            defaultValue="pk_live_51NxQaB..."
                            className="h-9 pr-10 font-mono text-sm"
                          />
                          <button
                            onClick={() => setShowStripe(!showStripe)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showStripe ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Secret Key</label>
                        <Input type="password" defaultValue="sk_live_51NxQaB..." className="h-9 font-mono text-sm" />
                      </div>
                    </div>
                  </div>
                  {/* PayPal */}
                  <div className="border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">P</span>
                        </div>
                        <span className="font-semibold text-slate-900">PayPal</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Connected</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Client ID</label>
                        <div className="relative">
                          <Input
                            type={showPayPal ? "text" : "password"}
                            defaultValue="AaBbCcDd12345..."
                            className="h-9 pr-10 font-mono text-sm"
                          />
                          <button
                            onClick={() => setShowPayPal(!showPayPal)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPayPal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Business Email</label>
                        <Input type="email" defaultValue="payments@eazytech.com" className="h-9 text-sm" />
                      </div>
                    </div>
                  </div>
                  {/* Platform cut */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Platform Revenue Share (%)</label>
                    <div className="flex items-center gap-4">
                      <Input type="number" defaultValue={30} min={0} max={100} className="h-10 w-32" />
                      <p className="text-xs text-slate-500">Instructors keep 70% of each sale after this deduction.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          {activeTab === "Email" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-1">Email Configuration</h3>
              <p className="text-xs text-slate-500 mb-5">Configure transactional email via SMTP or Resend.</p>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Provider</label>
                  <select className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20">
                    <option>Resend</option>
                    <option>SendGrid</option>
                    <option>SMTP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">From Address</label>
                  <Input defaultValue="no-reply@eazytech.com" type="email" className="h-10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">API Key</label>
                  <Input type="password" defaultValue="re_xxxxxxxxxxxx" className="h-10 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Reply-To</label>
                  <Input defaultValue="support@eazytech.com" type="email" className="h-10" />
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "Security" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-base font-bold text-slate-900 mb-1">Security Enforcement</h3>
                <p className="text-xs text-slate-500 mb-5">Platform-wide access control and session settings.</p>
                <div className="space-y-5">
                  {/* 2FA */}
                  <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Require 2FA for Admins</p>
                      <p className="text-xs text-slate-500 mt-0.5">All admin accounts must use two-factor authentication</p>
                    </div>
                    <button
                      onClick={() => setTwoFA(!twoFA)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${twoFA ? "bg-[#FF510E]" : "bg-slate-200"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${twoFA ? "translate-x-7" : "translate-x-1"}`} />
                    </button>
                  </div>
                  {/* Email verify */}
                  <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Email Verification on Signup</p>
                      <p className="text-xs text-slate-500 mt-0.5">New users must verify their email before accessing content</p>
                    </div>
                    <button
                      onClick={() => setEmailVerify(!emailVerify)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${emailVerify ? "bg-[#FF510E]" : "bg-slate-200"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${emailVerify ? "translate-x-7" : "translate-x-1"}`} />
                    </button>
                  </div>
                  {/* Session timeout */}
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Session Timeout (minutes)</p>
                      <p className="text-xs text-slate-500 mt-0.5">Inactive sessions are automatically logged out</p>
                    </div>
                    <Input type="number" defaultValue={60} className="w-24 h-9 text-center" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === "Integrations" && (
            <div className="space-y-6">
              {/* Third-party plugins */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-base font-bold text-slate-900 mb-1">Third-Party Plugins</h3>
                <p className="text-xs text-slate-500 mb-5">Connect external services to extend platform capabilities.</p>
                <div className="space-y-3">
                  {[
                    { name: "Google Analytics",  desc: "Track user behaviour and marketing funnel",   connected: true  },
                    { name: "Zoom",              desc: "Live class and webinar scheduling integration", connected: false },
                    { name: "Intercom",          desc: "In-app customer support chat widget",           connected: false },
                    { name: "Zapier",            desc: "Connect to 5,000+ external apps",              connected: true  },
                  ].map((plugin) => (
                    <div key={plugin.name} className="flex items-center justify-between border border-slate-200 rounded-xl px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Puzzle className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{plugin.name}</p>
                          <p className="text-xs text-slate-500">{plugin.desc}</p>
                        </div>
                      </div>
                      <button
                        className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors ${
                          plugin.connected
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-[#FF510E] text-white hover:bg-orange-600"
                        }`}
                      >
                        {plugin.connected ? "Connected" : "Connect"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* AWS Cloud card */}
              <div className="bg-slate-800 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center">
                    <Cloud className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-white font-bold">AWS Cloud Instance</p>
                    <p className="text-slate-400 text-sm mt-0.5">t3.medium · us-east-1 · Running</p>
                    <p className="text-emerald-400 text-xs mt-1">Uptime: 99.97% · Last checked 2 min ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">$48.20</p>
                  <p className="text-xs text-slate-400">estimated this month</p>
                  <button className="mt-2 text-xs font-semibold text-[#FF510E] hover:underline">Manage Instance →</button>
                </div>
              </div>
            </div>
          )}

          {/* Save bar */}
          <div className="mt-8 flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-6 py-4">
            <p className="text-sm text-slate-500">Changes are not auto-saved. Click Save to apply.</p>
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-2 font-semibold text-sm px-6 py-2.5 rounded-lg transition-all ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-[#FF510E] hover:bg-orange-600 text-white"
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
