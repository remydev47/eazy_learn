import Link from "next/link";
import { LayoutDashboard, BookOpen, ClipboardList, Calendar, Award } from "lucide-react";
import { signOut } from "@/lib/auth";

const items = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
  { key: "courses", label: "My Courses", href: "/dashboard/student/courses", icon: BookOpen },
  { key: "assignments", label: "Assignments", href: "/dashboard/student/assignments", icon: ClipboardList },
  { key: "schedule", label: "Schedule", href: "/dashboard/student/schedule", icon: Calendar },
  { key: "certificates", label: "Certificates", href: "/dashboard/student/certificates", icon: Award },
];

export default function StudentSidebar({ active }: { active: string }) {
  return (
    <aside className="w-52 shrink-0 bg-white border-r border-slate-100 flex flex-col">
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-0.5">
          <span className="text-xl font-bold text-slate-900">Kode</span>
          <span className="text-xl font-bold text-[#1A6EF5]">Class</span>
        </Link>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Academic Portal</p>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${item.key === active ? "bg-[#1A6EF5] text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
              <Icon className="w-4 h-4 shrink-0" />{item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 pb-6">
        <Link href="/" className="block text-xs font-medium text-slate-500 hover:text-slate-900 py-2">← Back to site</Link>
        <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
          <button type="submit" className="w-full text-left text-xs font-medium text-slate-500 hover:text-slate-900 py-2">Sign out</button>
        </form>
      </div>
    </aside>
  );
}
