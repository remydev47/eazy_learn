import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Video } from "lucide-react";
import { auth } from "@/lib/auth";
import { moodleAPI } from "@/lib/moodle/client";
import StudentSidebar from "@/components/dashboard/StudentSidebar";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const enrolled = await moodleAPI.getEnrolledCourses(session.user.moodleId).catch(() => []);
  const courseIds = enrolled.map((c) => c.id);
  const nowSec = Date.now() / 1000;

  // Upcoming deadlines from assignments + calendar.
  const deadlines: { title: string; ts: number }[] = [];
  if (courseIds.length) {
    try {
      const a = await moodleAPI.getUpcomingAssignments(courseIds);
      a.courses.forEach((c) => c.assignments.forEach((x) => { if (x.duedate > nowSec) deadlines.push({ title: x.name, ts: x.duedate }); }));
    } catch { /* */ }
    try {
      const e = await moodleAPI.getCalendarEvents(courseIds);
      e.events.forEach((ev) => { if (ev.timestart > nowSec) deadlines.push({ title: ev.name, ts: ev.timestart }); });
    } catch { /* */ }
  }
  deadlines.sort((x, y) => x.ts - y.ts);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <StudentSidebar active="schedule" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Schedule</h1>
          <p className="text-slate-500 mt-1 mb-8">Your upcoming deadlines and live classes.</p>

          <h2 className="text-lg font-bold text-slate-900 mb-3">Live classes</h2>
          {enrolled.length === 0 ? (
            <p className="text-sm text-slate-400 mb-8">Enrol in a course to access live classes.</p>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 mb-10">
              {enrolled.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm font-medium text-slate-800">{c.fullname}</span>
                  <Link href={`/live/${c.shortname}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A6EF5] hover:underline">
                    <Video className="w-3.5 h-3.5" /> Join room
                  </Link>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-lg font-bold text-slate-900 mb-3">Upcoming deadlines</h2>
          {deadlines.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" /> No upcoming deadlines.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {deadlines.map((d, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm font-medium text-slate-800">{d.title}</span>
                  <span className="text-xs text-slate-500">{new Date(d.ts * 1000).toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short" })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
