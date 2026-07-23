import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { FileText, Video, Link2, FileQuestion, PenSquare, MessageCircle, ExternalLink } from "lucide-react";
import { auth } from "@/lib/auth";
import { getCatalogCourseBySlug } from "@/lib/moodle/catalog";
import { moodleAPI } from "@/lib/moodle/client";
import type { CourseModule } from "@/lib/moodle/types";

export const dynamic = "force-dynamic";

const MOODLE_URL = process.env.MOODLE_URL ?? "";

const proxy = (fileurl: string) => `/api/course-file?url=${encodeURIComponent(fileurl)}`;

function ytEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vim = url.match(/vimeo\.com\/(\d+)/);
  if (vim) return `https://player.vimeo.com/video/${vim[1]}`;
  return null;
}

// Rewrite Moodle pluginfile links in HTML (labels) to go through our token proxy.
function rewriteHtml(html: string): string {
  return html.replace(/(src|href)="([^"]*\/pluginfile\.php\/[^"]*)"/g, (_m, attr, url) => `${attr}="${proxy(url)}"`);
}

function ModuleView({ m }: { m: CourseModule }) {
  if (m.modname === "label") {
    return m.description ? (
      <div className="prose prose-sm max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: rewriteHtml(m.description) }} />
    ) : null;
  }

  if (m.modname === "resource" && m.contents?.length) {
    return (
      <div className="space-y-3">
        <p className="font-semibold text-slate-800 flex items-center gap-2"><FileText className="w-4 h-4 text-[#1A6EF5]" />{m.name}</p>
        {m.contents.filter((c) => c.type === "file" && c.fileurl).map((c, i) => {
          const url = proxy(c.fileurl!);
          if (c.mimetype?.startsWith("video/")) {
            return <video key={i} controls className="w-full rounded-lg border border-slate-200"><source src={url} type={c.mimetype} /></video>;
          }
          if (c.mimetype?.startsWith("image/")) {
            // eslint-disable-next-line @next/next/no-img-element
            return <img key={i} src={url} alt={c.filename} className="max-w-full rounded-lg border border-slate-200" />;
          }
          if (c.mimetype === "application/pdf") {
            return <iframe key={i} src={url} title={c.filename} className="w-full h-[70vh] rounded-lg border border-slate-200" />;
          }
          return (
            <a key={i} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-[#1A6EF5] hover:underline">
              <FileText className="w-4 h-4" /> {c.filename}
            </a>
          );
        })}
      </div>
    );
  }

  if (m.modname === "url" && m.contents?.[0]?.fileurl) {
    const ext = m.contents[0].fileurl;
    const embed = ytEmbed(ext);
    return (
      <div className="space-y-2">
        <p className="font-semibold text-slate-800 flex items-center gap-2"><Video className="w-4 h-4 text-[#1A6EF5]" />{m.name}</p>
        {embed ? (
          <div className="relative aspect-video"><iframe className="absolute inset-0 w-full h-full rounded-lg border border-slate-200" src={embed} title={m.name} allowFullScreen /></div>
        ) : (
          <a href={ext} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-[#1A6EF5] hover:underline"><Link2 className="w-4 h-4" /> Open link</a>
        )}
      </div>
    );
  }

  // Interactive / other activities run in Moodle.
  const icon = m.modname === "quiz" ? FileQuestion : m.modname === "assign" ? PenSquare : m.modname === "forum" ? MessageCircle : FileText;
  const Icon = icon;
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-slate-800 flex items-center gap-2"><Icon className="w-4 h-4 text-slate-400" />{m.name}</span>
      {m.url && (
        <a href={m.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A6EF5] hover:underline">
          Open <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.moodleId) redirect(`/login?callbackUrl=${encodeURIComponent(`/learn/${slug}`)}`);

  const course = await getCatalogCourseBySlug(slug);
  if (!course?.moodleId) notFound();

  // Gate: enrolled students (or staff) only.
  let allowed = session.user.role === "admin" || session.user.role === "instructor";
  if (!allowed) {
    try {
      const enrolled = await moodleAPI.getEnrolledCourses(session.user.moodleId, { revalidate: 0 });
      allowed = enrolled.some((c) => c.id === course.moodleId);
    } catch { allowed = false; }
  }
  if (!allowed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Enrol to access this course</h1>
          <p className="text-slate-500 mb-6">Buy <strong>{course.title}</strong> to start learning.</p>
          <Link href={`/courses/${slug}`} className="inline-block bg-[#1A6EF5] hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg">View course</Link>
        </div>
      </main>
    );
  }

  const sections = (await moodleAPI.getCourseContents(course.moodleId, { revalidate: 30 }).catch(() => []))
    .filter((s) => s.modules && s.modules.length > 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard/student" className="text-sm text-slate-500 hover:text-slate-900">← My dashboard</Link>
          <span className="text-sm font-semibold text-slate-800 truncate px-3">{course.title}</span>
          <Link href={`/live/${slug}`} className="text-xs font-semibold text-[#1A6EF5] hover:underline whitespace-nowrap">Join Live</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{course.title}</h1>
        <p className="text-sm text-slate-500 mb-8">Course content · quizzes and assignments open in the learning platform.</p>

        {sections.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500">
            No content has been added to this course yet. Check back soon.
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((s) => (
              <section key={s.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="font-bold text-slate-900">{s.name || `Section ${s.section}`}</h2>
                </div>
                <div className="p-6 space-y-6">
                  {s.modules.map((m) => (
                    <div key={m.id}><ModuleView m={m} /></div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
