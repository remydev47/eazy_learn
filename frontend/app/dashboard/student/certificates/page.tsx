import Link from "next/link";
import { redirect } from "next/navigation";
import { Award } from "lucide-react";
import { auth } from "@/lib/auth";
import { moodleAPI } from "@/lib/moodle/client";
import StudentSidebar from "@/components/dashboard/StudentSidebar";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const moodleUrl = process.env.NEXT_PUBLIC_MOODLE_URL ?? "#";

  const enrolled = await moodleAPI.getEnrolledCourses(session.user.moodleId).catch(() => []);
  const completed = enrolled.filter((c) => typeof c.progress === "number" && c.progress >= 100);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <StudentSidebar active="certificates" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Certificates</h1>
          <p className="text-slate-500 mt-1 mb-8">
            You earn a certificate when you complete a course. Download it from the course once available.
          </p>

          {completed.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              No certificates yet — finish a course to earn your first one.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {completed.map((c) => (
                <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-6">
                  <Award className="w-8 h-8 text-amber-500 mb-3" />
                  <h3 className="font-bold text-slate-900 mb-1">{c.fullname}</h3>
                  <p className="text-xs text-emerald-600 font-semibold mb-4">Completed</p>
                  <a href={`${moodleUrl}/course/view.php?id=${c.id}`} className="text-sm font-semibold text-[#1A6EF5] hover:underline">
                    View certificate →
                  </a>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-400 mt-6">
            <Link href="/dashboard/student" className="hover:underline">← Back to dashboard</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
