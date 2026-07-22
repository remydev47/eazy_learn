import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Award,
  MessageSquare,
  PlayCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { moodleAPI } from "@/lib/moodle/client";
import { getCatalog } from "@/lib/moodle/catalog";
import type { MoodleCourse } from "@/lib/moodle/types";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

// Always render with the signed-in user's live Moodle data.
export const dynamic = "force-dynamic";

const navItems = [
  { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard, active: true },
  { label: "My Courses", href: "/dashboard/student/courses", icon: BookOpen },
  { label: "Assignments", href: "/dashboard/student/assignments", icon: ClipboardList },
  { label: "Certificates", href: "/dashboard/student/certificates", icon: Award },
  { label: "Messages", href: "/dashboard/student/messages", icon: MessageSquare },
];

// Fallback course-card images used when Moodle returns the default generated SVG
// (which won't render in the browser without the auth token).
const fallbackImages = ["/assets/less4.webp", "/assets/less3.webp", "/assets/less9.webp"];

interface DashboardCourse {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  instructors: string[];
  image: string;
}

interface Deadline {
  title: string;
  due: string;
  urgent: boolean;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

/** Human-friendly relative due label, e.g. "Due today, 5:00 PM" / "Due tomorrow" / "Mar 14". */
function formatDue(tsSeconds: number): string {
  const ms = tsSeconds * 1000;
  const now = new Date();
  const due = new Date(ms);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayMs = 86_400_000;
  const dayDiff = Math.floor((new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime() - startOfToday) / dayMs);
  const time = due.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (dayDiff === 0) return `Due today, ${time}`;
  if (dayDiff === 1) return `Due tomorrow, ${time}`;
  if (dayDiff > 1 && dayDiff < 7) return `Due ${due.toLocaleDateString("en-US", { weekday: "long" })}`;
  return `Due ${due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

function mapCourseForCard(
  course: MoodleCourse,
  index: number,
  teachers: Map<number, string[]>,
): DashboardCourse {
  const progress = typeof course.progress === "number" ? Math.round(course.progress) : 0;
  // Moodle returns courseimage as either a real file URL or a generated SVG that
  // requires auth — fall back to local marketing images so the card always renders.
  const isGeneratedSvg = course.courseimage?.includes("/generated/course.svg") ?? true;
  const image = isGeneratedSvg ? fallbackImages[index % fallbackImages.length] : course.courseimage!;
  const initials = teachers.get(course.id) ?? [];
  return {
    id: course.id,
    slug: course.shortname,
    title: course.fullname,
    description: stripHtml(course.summary) || "No description provided.",
    category: course.shortname.split("-")[0] || "General",
    progress,
    instructors: initials,
    image,
  };
}

/** Map of courseId → teacher initials, from each course's Moodle contacts. */
async function getTeacherInitials(courseIds: number[]): Promise<Map<number, string[]>> {
  const map = new Map<number, string[]>();
  if (courseIds.length === 0) return map;
  try {
    const { courses } = await moodleAPI.getCoursesByField("ids", courseIds.join(","));
    for (const course of courses) {
      const initials = (course.contacts ?? []).map((c) => initialsOf(c.fullname));
      if (initials.length) map.set(course.id, initials);
    }
  } catch (err) {
    console.error("[student] getTeacherInitials failed:", err);
  }
  return map;
}

/** Upcoming deadlines from assignments + calendar events, deduped, future-only, soonest first. */
async function getDeadlines(courseIds: number[]): Promise<Deadline[]> {
  if (courseIds.length === 0) return [];
  const nowSec = Date.now() / 1000;
  const soonCutoff = nowSec + 2 * 86_400; // within 48h = urgent
  const collected: Array<{ title: string; ts: number }> = [];
  try {
    const { courses } = await moodleAPI.getUpcomingAssignments(courseIds);
    for (const c of courses) {
      for (const a of c.assignments) {
        if (a.duedate > nowSec) collected.push({ title: a.name, ts: a.duedate });
      }
    }
  } catch (err) {
    console.error("[student] getUpcomingAssignments failed:", err);
  }
  try {
    const { events } = await moodleAPI.getCalendarEvents(courseIds);
    for (const e of events) {
      if (e.timestart > nowSec) collected.push({ title: e.name, ts: e.timestart });
    }
  } catch (err) {
    console.error("[student] getCalendarEvents failed:", err);
  }
  // Dedupe by title+day (assignments and calendar often mirror each other).
  const seen = new Set<string>();
  return collected
    .sort((a, b) => a.ts - b.ts)
    .filter((d) => {
      const key = `${d.title.toLowerCase()}|${Math.floor(d.ts / 86_400)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 4)
    .map((d) => ({ title: d.title, due: formatDue(d.ts), urgent: d.ts <= soonCutoff }));
}

/** A real catalog course the student is NOT yet enrolled in, for "Recommended for You". */
async function getRecommendation(enrolledIds: number[]) {
  try {
    const catalog = await getCatalog();
    const enrolled = new Set(enrolledIds);
    return catalog.find((c) => !enrolled.has(c.id)) ?? null;
  } catch (err) {
    console.error("[student] getRecommendation failed:", err);
    return null;
  }
}

export default async function StudentDashboardPage() {
  const moodleUrl = process.env.NEXT_PUBLIC_MOODLE_URL ?? "#";

  // Middleware should redirect unauthenticated users; this is defense in depth.
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { moodleId, name } = session.user;

  // Primary fetch: the student's enrolled courses (each carries live progress).
  const rawCourses = await moodleAPI.getEnrolledCourses(moodleId);
  const courseIds = rawCourses.map((c) => c.id);

  // Enrich with everything else in parallel. Each is resilient: a failure or empty
  // result degrades to an empty section rather than breaking the dashboard.
  const [teacherMap, deadlines, recommended] = await Promise.all([
    getTeacherInitials(courseIds),
    getDeadlines(courseIds),
    getRecommendation(courseIds),
  ]);

  const enrolledCourses = rawCourses.map((c, i) => mapCourseForCard(c, i, teacherMap));
  const inProgress =
    enrolledCourses.find((c) => c.progress > 0 && c.progress < 100) ?? enrolledCourses[0] ?? null;

  // Real, derived stats — no placeholders.
  const completedCount = enrolledCourses.filter((c) => c.progress >= 100).length;
  const avgProgress = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length)
    : 0;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── Sidebar ── */}
      <aside className="w-52 shrink-0 bg-white border-r border-slate-100 flex flex-col">
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <Link href="/">
            <span className="text-xl font-bold text-[#1A6EF5]">KodeClass</span>
          </Link>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
            Academic Portal
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
                    ? "bg-[#1A6EF5] text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Upcoming Deadlines
          </p>
          <div className="space-y-2">
            {deadlines.length === 0 ? (
              <p className="text-xs text-slate-400 leading-snug">No upcoming deadlines.</p>
            ) : (
              deadlines.map((d, i) => (
                <div key={`${d.title}-${i}`} className="border-l-2 border-[#1A6EF5] pl-3 py-1">
                  <p className="text-xs font-medium text-slate-800 leading-snug">{d.title}</p>
                  <p className={`text-xs mt-0.5 ${d.urgent ? "text-rose-500" : "text-slate-400"}`}>
                    {d.due}
                  </p>
                </div>
              ))
            )}
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
            className="mt-6"
          >
            <button
              type="submit"
              className="w-full text-left text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors py-2"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Welcome header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {(name ?? "").split(" ")[0] || name}
              </h1>
              <p className="text-slate-500 mt-1">
                {enrolledCourses.length === 0
                  ? "Browse the catalog and enroll in your first course to get started."
                  : completedCount > 0
                    ? `You've completed ${completedCount} ${completedCount === 1 ? "course" : "courses"} — keep up the momentum!`
                    : "You're making progress. Keep going!"}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-slate-900">{enrolledCourses.length}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">Courses</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">Completed</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-slate-900">{avgProgress}%</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">Avg Progress</p>
              </div>
            </div>
          </div>

          {/* Continue Learning Banner */}
          {inProgress ? (
            <div className="relative rounded-2xl overflow-hidden mb-10 min-h-[200px] flex items-center">
              <Image
                src={inProgress.image}
                alt={inProgress.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-transparent" />
              <div className="relative z-10 px-8 py-10 max-w-xl">
                <span className="text-xs font-semibold tracking-widest text-[#1A6EF5] uppercase">
                  Continue Learning
                </span>
                <h2 className="text-2xl font-bold text-white mt-2 mb-1">{inProgress.title}</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-1.5 bg-white/25 rounded-full overflow-hidden max-w-xs">
                    <div
                      className="h-full bg-[#1A6EF5] rounded-full"
                      style={{ width: `${inProgress.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-white/80">{inProgress.progress}% Complete</span>
                </div>
                <a
                  href={`${moodleUrl}/course/view.php?id=${inProgress.id}`}
                  className="inline-flex items-center gap-2 bg-[#1A6EF5] hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  {inProgress.progress === 0 ? "Start course" : "Resume"}
                </a>
              </div>
            </div>
          ) : null}

          {/* My Enrolled Courses */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">My Enrolled Courses</h2>
              <Link
                href="/dashboard/student/courses"
                className="text-sm text-[#1A6EF5] font-medium hover:underline"
              >
                View All →
              </Link>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">You&apos;re not enrolled in any courses yet.</p>
                <Link
                  href="/courses"
                  className="inline-block mt-4 bg-[#1A6EF5] hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-lg"
                >
                  Browse courses
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative h-44">
                      <Image src={course.image} alt={course.title} fill className="object-cover" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-slate-800 text-xs font-semibold">
                          {course.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 mb-1 leading-snug">{course.title}</h3>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-end">
                        <span className="text-sm font-semibold text-[#1A6EF5]">
                          {course.progress}% Complete
                        </span>
                      </div>
                      <Progress
                        value={course.progress}
                        className="mt-3 h-1.5 [&>div]:bg-[#1A6EF5]"
                      />
                      <div className="mt-4 flex gap-2">
                        <a
                          href={`${moodleUrl}/course/view.php?id=${course.id}`}
                          className="flex-1 text-center text-xs font-semibold bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          Course content
                        </a>
                        <Link
                          href={`/live/${course.slug}`}
                          className="flex-1 text-center text-xs font-semibold border border-[#1A6EF5] text-[#1A6EF5] py-2 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Join Live Class
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended for You — a real catalog course the student isn't enrolled in */}
          {recommended ? (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-5">Recommended for You</h2>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{recommended.title}</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {recommended.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recommended.rating > 0 ? (
                        <Badge variant="outline" className="text-xs font-medium border-slate-300 text-slate-600">
                          {recommended.rating.toFixed(1)} ★ Rating
                        </Badge>
                      ) : null}
                      <Badge variant="outline" className="text-xs font-medium border-slate-300 text-slate-600">
                        {recommended.totalLessons} Sessions
                      </Badge>
                      <Badge variant="outline" className="text-xs font-medium border-slate-300 text-slate-600">
                        {recommended.level}
                      </Badge>
                    </div>
                  </div>
                  <Link
                    href={`/courses/${recommended.slug}`}
                    className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors shrink-0"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <footer className="bg-slate-900 text-slate-400 mt-auto">
          <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between gap-4 text-xs">
            <div>
              <p className="text-white font-bold mb-1">KodeClass</p>
              <p>Empowering the next generation of global learners.</p>
            </div>
            <div className="flex gap-6 items-center">
              <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
              <Link href="/instructors" className="hover:text-white transition-colors">Instructors</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div className="border-t border-slate-800">
            <p className="text-center text-xs text-slate-600 py-4">© 2026 KodeClass. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
