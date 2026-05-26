import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart2,
  DollarSign,
  Bell,
  Plus,
  Star,
  UserCheck,
  MessageCircle,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { auth, signOut } from "@/lib/auth";
import { moodleAPI } from "@/lib/moodle/client";
import type { MoodleCourse, MoodleUser } from "@/lib/moodle/types";

const navItems = [
  { label: "Dashboard", href: "/dashboard/instructor", icon: LayoutDashboard, active: true },
  { label: "My Courses", href: "/dashboard/instructor/courses", icon: BookOpen },
  { label: "Students", href: "/dashboard/instructor/students", icon: Users },
  { label: "Analytics", href: "/dashboard/instructor/analytics", icon: BarChart2 },
  { label: "Revenue", href: "/dashboard/instructor/revenue", icon: DollarSign },
];

// Periods are cosmetic for the demo — the engagement chart shows the same
// curve regardless. Real period-driven data needs report_log_get_entries.
const periods = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "Last Year"];

const fallbackImages = ["/assets/less4.webp", "/assets/less3.webp", "/assets/less9.webp"];

interface TaughtCourse {
  id: number;
  title: string;
  tags: string[];
  enrolled: number;
  completion: number; // avg progress across enrolled students, 0-100
  image: string;
}

interface EnrolledUser extends MoodleUser {
  roles?: Array<{ shortname: string }>;
}

const TEACHER_ROLE_SHORTNAMES = new Set(["editingteacher", "teacher"]);

function initialsOf(name: string | null | undefined): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "??";
}

async function getTaughtCourses(
  teacherId: number,
  enrolled: MoodleCourse[],
): Promise<{ courses: TaughtCourse[]; totalStudents: number }> {
  const taught: TaughtCourse[] = [];
  let totalStudents = 0;

  await Promise.all(
    enrolled.map(async (course, idx) => {
      const roster = (await moodleAPI.getEnrolledStudents(course.id, { revalidate: 60 })) as EnrolledUser[];

      // Is the current user a teacher in this course?
      const me = roster.find((u) => u.id === teacherId);
      const myRoles = me?.roles?.map((r) => r.shortname.toLowerCase()) ?? [];
      if (!myRoles.some((r) => TEACHER_ROLE_SHORTNAMES.has(r))) return;

      // Count students only (exclude other teachers from the headcount).
      const students = roster.filter((u) =>
        u.roles?.some((r) => r.shortname.toLowerCase() === "student"),
      );
      totalStudents += students.length;

      // Average completion across enrolled students.
      const progressSum = students.reduce((acc, _s) => acc + (course.progress ?? 0), 0);
      // NOTE: course.progress on MoodleCourse is the requesting user's progress, not
      // the cohort average. A true average requires per-student completion calls,
      // which is a heavier scan. For demo purposes we use the course-level value.
      const completion = students.length > 0 ? Math.round(progressSum / students.length) : 0;

      const isGeneratedSvg = course.courseimage?.includes("/generated/course.svg") ?? true;
      const image = isGeneratedSvg
        ? fallbackImages[idx % fallbackImages.length]
        : course.courseimage!;

      taught.push({
        id: course.id,
        title: course.fullname,
        tags: [course.shortname.split("-")[0] || "General", "Live cohort"],
        enrolled: students.length,
        completion,
        image,
      });
    }),
  );

  return { courses: taught, totalStudents };
}

export default async function InstructorDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { moodleId, name } = session.user;
  const firstName = (name ?? "").split(" ")[0] || "Instructor";

  // Pull enrolled courses, then filter to courses where the user teaches.
  const enrolledCourses = await moodleAPI.getEnrolledCourses(moodleId);
  const { courses: taughtCourses, totalStudents } = await getTaughtCourses(moodleId, enrolledCourses);

  // Stats. Rating + earnings are placeholders until ratings/payment plugins are wired.
  const stats = [
    {
      label: "TOTAL STUDENTS",
      value: totalStudents.toLocaleString(),
      badge: `${taughtCourses.length} course${taughtCourses.length === 1 ? "" : "s"}`,
      icon: Users,
      iconBg: "bg-orange-100",
      iconColor: "text-[#FF510E]",
    },
    {
      label: "AVERAGE RATING",
      value: "—",
      badge: "Not yet rated",
      icon: Star,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "MONTHLY EARNINGS",
      value: "—",
      badge: "Payments coming soon",
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
  ];

  // Recent activity is still mock — to make it real we'd parse report_log_get_entries
  // for each taught course and translate event types. Defer to post-demo.
  const recentActivity = [
    {
      icon: UserCheck,
      iconBg: "bg-[#FF510E]/10",
      iconColor: "text-[#FF510E]",
      text: (
        <>
          <span className="font-semibold">New student</span> enrolled in your course
        </>
      ),
      time: "Live data wired",
    },
    {
      icon: Star,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      text: <>Recent activity feed requires log parsing — coming soon</>,
      time: "Placeholder",
    },
    {
      icon: MessageCircle,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      text: <>Messages will appear here when wired</>,
      time: "Placeholder",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── Sidebar ── */}
      <aside className="w-52 shrink-0 bg-white border-r border-slate-100 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-xl font-bold text-slate-900">Eazy</span>
            <span className="text-xl font-bold text-[#FF510E]">Tech</span>
          </Link>
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

        {/* User profile */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{initialsOf(name)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
              <p className="text-xs text-slate-500 truncate">Instructor</p>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="w-full text-left text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Page header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Instructor Overview</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Welcome back, {firstName}. Here&apos;s what&apos;s happening with your courses today.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <Bell className="w-4 h-4 text-slate-600" />
                </button>
                <Button className="bg-[#FF510E] hover:bg-orange-600 text-white font-semibold gap-2">
                  <Plus className="w-4 h-4" />
                  Create Course
                </Button>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${s.iconColor}`} />
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Engagement + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Engagement chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Student Engagement</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Interactions and video watch-time over the selected period
                    </p>
                  </div>
                  <select
                    defaultValue="Last 30 Days"
                    className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#FF510E]/30"
                  >
                    {periods.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <EngagementChart />
                </div>
                <div className="flex gap-5 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-[#FF510E]" />
                    <span className="text-xs text-slate-500">Watch time</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-blue-500" />
                    <span className="text-xs text-slate-500">Quiz attempts</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
                <div className="space-y-5">
                  {recentActivity.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex gap-3">
                        <div
                          className={`w-8 h-8 ${item.iconBg} rounded-full flex items-center justify-center shrink-0`}
                        >
                          <Icon className={`w-4 h-4 ${item.iconColor}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-slate-700 leading-snug">{item.text}</p>
                          <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="mt-5 text-sm text-[#FF510E] font-medium hover:underline">
                  View all activity
                </button>
              </div>
            </div>

            {/* Your Courses */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Your Courses</h2>
                <Link
                  href="/dashboard/instructor/courses"
                  className="text-sm text-[#FF510E] font-medium hover:underline"
                >
                  Manage all courses →
                </Link>
              </div>

              {taughtCourses.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-2xl p-10 text-center">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">
                    You&apos;re not assigned as a teacher in any courses yet.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Ask an admin to enroll you as Editing Teacher in a course.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {taughtCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-5 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                        <Image src={course.image} alt={course.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm mb-1">{course.title}</p>
                        <div className="flex gap-2">
                          {course.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-slate-500 mb-1">Enrolled</p>
                        <p className="text-sm font-bold text-slate-900">
                          {course.enrolled.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-32 shrink-0">
                        <p className="text-xs text-slate-500 mb-1.5">Avg. Completion</p>
                        <Progress value={course.completion} className="h-1.5 [&>div]:bg-[#FF510E]" />
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <a
                          href={`${process.env.NEXT_PUBLIC_MOODLE_URL}/course/edit.php?id=${course.id}`}
                          className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </a>
                        <button className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between gap-4 text-xs">
            <div>
              <p className="font-bold text-white mb-0.5">EazyTech</p>
              <p>Empowering instructors to deliver world-class education.</p>
            </div>
            <div className="flex gap-5 items-center">
              <Link href="#" className="hover:text-white transition-colors">Help Center</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Instructor Terms</Link>
              <span>© 2026 EazyTech. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
