import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  LayoutDashboard,
  Users,
  BarChart2,
  CreditCard,
  ClipboardList,
  Award,
  MessageSquare,
  Settings,
  BookMarked,
} from "lucide-react";

const dashboards = [
  {
    role: "Student",
    description: "The learner experience — enrolled courses, progress tracking, assignments, certificates, and messaging.",
    href: "/dashboard/student",
    icon: GraduationCap,
    color: "bg-[#FF510E]",
    textColor: "text-[#FF510E]",
    borderColor: "border-orange-200",
    bgLight: "bg-orange-50",
    pages: [
      { label: "Dashboard overview",   href: "/dashboard/student",              icon: LayoutDashboard },
      { label: "My Courses",           href: "/dashboard/student/courses",      icon: BookMarked },
      { label: "Schedule",             href: "/dashboard/student/schedule",     icon: ClipboardList },
      { label: "Assignments",          href: "/dashboard/student/assignments",  icon: ClipboardList },
      { label: "Certificates",         href: "/dashboard/student/certificates", icon: Award },
      { label: "Messages",             href: "/dashboard/student/messages",     icon: MessageSquare },
      { label: "Settings",             href: "/dashboard/student/settings",     icon: Settings },
    ],
  },
  {
    role: "Instructor",
    description: "The teaching experience — course management, student engagement, analytics, revenue, and scheduling.",
    href: "/dashboard/instructor",
    icon: BookOpen,
    color: "bg-slate-800",
    textColor: "text-slate-800",
    borderColor: "border-slate-200",
    bgLight: "bg-slate-50",
    pages: [
      { label: "Dashboard overview",   href: "/dashboard/instructor",           icon: LayoutDashboard },
      { label: "My Courses",           href: "/dashboard/instructor/courses",   icon: BookMarked },
      { label: "Students",             href: "/dashboard/instructor/students",  icon: Users },
      { label: "Analytics",            href: "/dashboard/instructor/analytics", icon: BarChart2 },
      { label: "Revenue",              href: "/dashboard/instructor/revenue",   icon: CreditCard },
      { label: "Schedule",             href: "/dashboard/instructor/schedule",  icon: ClipboardList },
      { label: "Messages",             href: "/dashboard/instructor/messages",  icon: MessageSquare },
    ],
  },
  {
    role: "Admin",
    description: "The platform command centre — user management, course oversight, financials, analytics, settings, and system logs.",
    href: "/dashboard/admin",
    icon: ShieldCheck,
    color: "bg-violet-600",
    textColor: "text-violet-600",
    borderColor: "border-violet-200",
    bgLight: "bg-violet-50",
    pages: [
      { label: "Console overview",     href: "/dashboard/admin",            icon: LayoutDashboard },
      { label: "User Directory",       href: "/dashboard/admin/users",      icon: Users },
      { label: "Course Management",    href: "/dashboard/admin/courses",    icon: BookMarked },
      { label: "Financial Oversight",  href: "/dashboard/admin/revenue",    icon: CreditCard },
      { label: "Platform Analytics",   href: "/dashboard/admin/analytics",  icon: BarChart2 },
      { label: "System Settings",      href: "/dashboard/admin/settings",   icon: Settings },
      { label: "Activity Logs",        href: "/dashboard/admin/logs",       icon: ClipboardList },
    ],
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">Eazy</span>
            <span className="text-xl font-bold text-[#FF510E]">Tech</span>
            <span className="ml-2 text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
              Preview Mode
            </span>
          </div>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">
            ← Back to website
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Intro */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Dashboard Preview
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            All three role-based dashboards are built and ready to review. Click any card or sub-page link below to explore. No login required in this preview mode.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            All data shown is static mock data — live Moodle data replaces it after backend setup
          </div>
        </div>

        {/* Dashboard cards */}
        <div className="grid gap-8">
          {dashboards.map((dash) => {
            const Icon = dash.icon;
            return (
              <div key={dash.role} className={`bg-white rounded-3xl border ${dash.borderColor} overflow-hidden shadow-sm`}>
                {/* Card header */}
                <div className={`${dash.bgLight} px-8 py-6 flex items-center justify-between border-b ${dash.borderColor}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${dash.color} rounded-2xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Role</p>
                      <h2 className="text-2xl font-bold text-slate-900">{dash.role}</h2>
                    </div>
                  </div>
                  <Link
                    href={dash.href}
                    className={`inline-flex items-center gap-2 ${dash.color} hover:opacity-90 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-opacity`}
                  >
                    Open {dash.role} Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Description + sub-pages */}
                <div className="px-8 py-6">
                  <p className="text-slate-600 text-sm mb-6 max-w-2xl">{dash.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {dash.pages.map((page) => {
                      const PageIcon = page.icon;
                      return (
                        <Link
                          key={page.href}
                          href={page.href}
                          className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
                        >
                          <PageIcon className={`w-4 h-4 ${dash.textColor} shrink-0`} />
                          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 truncate">
                            {page.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Marketing site links */}
        <div className="mt-10 bg-white rounded-3xl border border-slate-200 px-8 py-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Marketing Website Pages</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Home",        href: "/" },
              { label: "Courses",     href: "/courses" },
              { label: "Instructors", href: "/instructors" },
              { label: "Resources",   href: "/resources" },
              { label: "Pricing",     href: "/pricing" },
              { label: "About",       href: "/about" },
              { label: "Contact",     href: "/contact" },
              { label: "404 Page",    href: "/this-does-not-exist" },
            ].map((p) => (
              <Link key={p.href} href={p.href}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                {p.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-10">
          This page is accessible at <span className="font-mono text-slate-600">/demo</span> · Remove or password-protect it before public launch
        </p>
      </div>
    </div>
  );
}
