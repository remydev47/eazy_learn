import { redirect } from "next/navigation";
import { Users, BookOpen, GraduationCap, DollarSign, TrendingUp } from "lucide-react";
import { auth } from "@/lib/auth";
import { moodleAPI } from "@/lib/moodle/client";
import { getCatalog } from "@/lib/moodle/catalog";
import { getRevenueTotals } from "@/lib/paystack";
import AdminSidebar from "@/components/dashboard/AdminSidebar";

export const dynamic = "force-dynamic";

const WEEK = 7 * 24 * 3600;

function StatCard({ label, value, sub, icon: Icon, tone = "blue" }: {
  label: string; value: string; sub?: string; icon: React.ElementType; tone?: string;
}) {
  const tones: Record<string, string> = {
    blue: "bg-blue-100 text-[#1A6EF5]", green: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600", violet: "bg-violet-100 text-violet-600",
  };
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${tones[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect(`/dashboard/${session.user.role}`);

  // Fetch real data in parallel.
  const [usersResp, catalog, revenue] = await Promise.all([
    moodleAPI.getAllUsers({ revalidate: 60 }).catch(() => ({ users: [] })),
    getCatalog(),
    getRevenueTotals(),
  ]);

  // Exclude the Moodle guest account (id 1) from user counts.
  const users = (usersResp.users ?? []).filter((u) => u.id !== 1);
  const totalUsers = users.length;
  const nowSec = Date.now() / 1000;
  const activeThisWeek = users.filter((u) => (u.lastaccess ?? 0) > nowSec - WEEK).length;
  const recent = [...users].sort((a, b) => b.id - a.id).slice(0, 8);

  // Enrolment counts per course (parallel).
  const enrolCounts = await Promise.all(
    catalog.map(async (c) => {
      if (!c.moodleId) return { course: c, count: 0 };
      try {
        const roster = await moodleAPI.getEnrolledStudents(c.moodleId, { revalidate: 120 });
        const students = roster.filter((u) =>
          u.roles?.some((r) => r.shortname.toLowerCase() === "student"),
        );
        return { course: c, count: students.length };
      } catch {
        return { course: c, count: 0 };
      }
    }),
  );
  const totalEnrolments = enrolCounts.reduce((s, e) => s + e.count, 0);
  const topCourses = [...enrolCounts].sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar active="dashboard" />

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Console</h1>
          <p className="text-slate-500 mt-1 mb-8">Live platform metrics from Moodle and Paystack.</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Users" value={totalUsers.toLocaleString()} sub={`${activeThisWeek} active this week`} icon={Users} tone="blue" />
            <StatCard label="Courses" value={catalog.length.toLocaleString()} icon={BookOpen} tone="violet" />
            <StatCard label="Enrolments" value={totalEnrolments.toLocaleString()} sub="across all courses" icon={GraduationCap} tone="amber" />
            <StatCard label="Revenue (KES)" value={revenue.totalKes.toLocaleString()} sub={`${revenue.count} payments · test mode`} icon={DollarSign} tone="green" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent signups */}
            <section className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Signups</h2>
              {recent.length === 0 ? (
                <p className="text-sm text-slate-400">No users yet.</p>
              ) : (
                <div className="space-y-3">
                  {recent.map((u) => (
                    <div key={u.id} className="flex items-center justify-between text-sm">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">{u.fullname}</p>
                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0 ml-3">
                        {u.lastaccess ? "active" : "new"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Courses by enrolment */}
            <section className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1A6EF5]" /> Courses by Enrolment
              </h2>
              <div className="space-y-2.5">
                {topCourses.map((e) => (
                  <div key={e.course.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 truncate pr-3">{e.course.title}</span>
                    <span className="font-semibold text-slate-900 shrink-0">{e.count}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
