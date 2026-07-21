import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCatalogCourseBySlug } from "@/lib/moodle/catalog";
import { moodleAPI } from "@/lib/moodle/client";
import { roomForCourse, JITSI_DOMAIN } from "@/lib/live";

export const dynamic = "force-dynamic";

export default async function LiveClassPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await auth();
  if (!session?.user?.moodleId) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/live/${slug}`)}`);
  }

  const course = await getCatalogCourseBySlug(slug);
  if (!course || !course.moodleId) notFound();

  // Gate: only enrolled students (or staff) can join a paid course's live room.
  const role = session.user.role;
  let allowed = role === "admin" || role === "instructor";
  if (!allowed) {
    try {
      const enrolled = await moodleAPI.getEnrolledCourses(session.user.moodleId, { revalidate: 0 });
      allowed = enrolled.some((c) => c.id === course.moodleId);
    } catch {
      allowed = false;
    }
  }

  if (!allowed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Enrol to join the live class</h1>
          <p className="text-slate-500 mb-6">
            The live sessions for <strong>{course.title}</strong> are for enrolled students.
          </p>
          <Link href="/pricing" className="inline-block bg-[#1A6EF5] hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg">
            View pricing
          </Link>
        </div>
      </main>
    );
  }

  const room = roomForCourse(slug);
  const displayName = encodeURIComponent(session.user.name ?? "Student");
  const src = `https://${JITSI_DOMAIN}/${room}#userInfo.displayName=%22${displayName}%22&config.prejoinPageEnabled=true`;

  return (
    <main className="min-h-screen flex flex-col bg-slate-900">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/student" className="text-sm text-slate-300 hover:text-white">← Dashboard</Link>
          <span className="text-sm font-semibold">Live class · {course.title}</span>
        </div>
        <span className="text-xs text-slate-400">Powered by Jitsi</span>
      </div>
      <iframe
        src={src}
        title={`Live class: ${course.title}`}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="flex-1 w-full border-0"
      />
    </main>
  );
}
