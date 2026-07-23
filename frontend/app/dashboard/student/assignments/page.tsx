import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { auth } from "@/lib/auth";
import { moodleAPI } from "@/lib/moodle/client";
import StudentSidebar from "@/components/dashboard/StudentSidebar";

export const dynamic = "force-dynamic";

function fmtDue(ts: number) {
  if (!ts) return "No due date";
  const d = new Date(ts * 1000);
  const now = Date.now() / 1000;
  const label = d.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
  return ts < now ? `Was due ${label}` : `Due ${label}`;
}

export default async function AssignmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const enrolled = await moodleAPI.getEnrolledCourses(session.user.moodleId).catch(() => []);
  const courseIds = enrolled.map((c) => c.id);
  const courseName = new Map(enrolled.map((c) => [c.id, c.fullname]));

  let items: { id: number; name: string; course: string; due: number; past: boolean }[] = [];
  if (courseIds.length) {
    try {
      const resp = await moodleAPI.getUpcomingAssignments(courseIds);
      const now = Date.now() / 1000;
      items = resp.courses.flatMap((c) =>
        c.assignments.map((a) => ({
          id: a.id, name: a.name, course: courseName.get(c.id) ?? c.fullname,
          due: a.duedate, past: a.duedate > 0 && a.duedate < now,
        })),
      ).sort((a, b) => (a.due || Infinity) - (b.due || Infinity));
    } catch { /* empty */ }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <StudentSidebar active="assignments" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
          <p className="text-slate-500 mt-1 mb-8">Assignments from your enrolled courses.</p>

          {items.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500">
              <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              No assignments yet. They&apos;ll appear here once your instructors add them.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {items.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-medium text-slate-800">{a.name}</p>
                    <p className="text-xs text-slate-400">{a.course}</p>
                  </div>
                  <span className={`text-xs font-semibold ${a.past ? "text-rose-500" : "text-slate-500"}`}>{fmtDue(a.due)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
