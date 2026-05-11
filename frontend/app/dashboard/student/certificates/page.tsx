import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList,
  Award, MessageSquare, Settings, HelpCircle, Download, Star,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const nav = [
  { label: "Dashboard",    href: "/dashboard/student",              icon: LayoutDashboard },
  { label: "My Courses",   href: "/dashboard/student/courses",      icon: BookOpen },
  { label: "Schedule",     href: "/dashboard/student/schedule",     icon: Calendar },
  { label: "Assignments",  href: "/dashboard/student/assignments",  icon: ClipboardList },
  { label: "Certificates", href: "/dashboard/student/certificates", icon: Award,          active: true },
  { label: "Messages",     href: "/dashboard/student/messages",     icon: MessageSquare },
  { label: "Settings",     href: "/dashboard/student/settings",     icon: Settings },
  { label: "Help",         href: "/dashboard/student/help",         icon: HelpCircle },
];

const certs = [
  {
    id: 1,
    title: "Professional Career Development for Creatives",
    grade: "Distinction",
    completed: "Sep 14, 2024",
    credential: "EZT-2024-78321",
    color: "from-[#FF510E] to-orange-700",
  },
  {
    id: 2,
    title: "Data-Driven Decision Making",
    grade: "Merit",
    completed: "Aug 02, 2024",
    credential: "EZT-2024-61049",
    color: "from-blue-600 to-blue-800",
  },
  {
    id: 3,
    title: "Advanced UI/UX Fundamentals: Digital Systems",
    grade: "Pass",
    completed: "Jul 20, 2024",
    credential: "EZT-2024-55218",
    color: "from-violet-600 to-violet-800",
  },
];

const inProgress = [
  { title: "Machine Learning Engineering",   progress: 72 },
  { title: "Cloud Architecture & DevOps",    progress: 34 },
];

export default function StudentCertificatesPage() {
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
          <h1 className="text-xl font-bold text-slate-900">My Certificates</h1>
          <p className="text-xs text-slate-500 mt-0.5">{certs.length} earned · {inProgress.length} in progress</p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">
          <h2 className="text-base font-bold text-slate-900 mb-4">Earned Certificates</h2>
          <div className="grid grid-cols-3 gap-5 mb-10">
            {certs.map((cert) => (
              <div key={cert.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Certificate preview */}
                <div className={`bg-gradient-to-br ${cert.color} p-6 relative`}>
                  <Award className="w-8 h-8 text-white/80 mb-3" />
                  <p className="text-white font-bold leading-snug text-sm line-clamp-2">{cert.title}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3 h-3 text-white/80 fill-white/80" />
                    <span className="text-white/80 text-xs font-semibold">{cert.grade}</span>
                  </div>
                  <p className="text-white/50 text-[10px] mt-2 font-mono">{cert.credential}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-500 mb-3">Completed {cert.completed}</p>
                  <button className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold py-2 rounded-lg transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-base font-bold text-slate-900 mb-4">In Progress</h2>
          <div className="space-y-3">
            {inProgress.map((course) => (
              <div key={course.title} className="bg-white rounded-2xl border border-slate-200 px-6 py-4 flex items-center gap-5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{course.title}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Progress value={course.progress} className="flex-1 h-2 [&>div]:bg-[#FF510E]" />
                    <span className="text-xs font-semibold text-slate-600 shrink-0">{course.progress}%</span>
                  </div>
                </div>
                <Link href="/dashboard/student/courses"
                  className="text-sm font-semibold text-[#FF510E] hover:underline shrink-0">
                  Continue →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
